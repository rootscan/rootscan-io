import groovy.transform.Field

@Field String PROJECTS = "block-explorer-indexer block-explorer" as String
@Field String APPS = 'api worker scheduler block-explorer'


def redeployProjects(String deploymentsString, String namespace, String link) {
    Collection deployments = deploymentsString.split(' ')
    deployments.each { project ->
        def workloadPath = "${link}:${namespace}:${project}"
        echo "Deploying ${project} in ${namespace}"
        rancherRedeploy alwaysPull: true, images: '', credential: 'rancher', workload: workloadPath
    }
}

static Boolean isMainBranch(String branchName) {
    return branchName == 'dev' || branchName == 'prod'
}

Boolean shouldBundle() {
    def commitMessage = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
    print commitMessage
    String branchName = env.BRANCH_NAME
    return commitMessage.contains('bundletest') || isMainBranch(branchName)
}


String getBundleSuffix() {
    if (env.BRANCH_NAME == "prod") {
        return "prod"
    } else {
        return "dev"
    }
}

def buildDockerImage(String project) {
    if (shouldBundle()) {
        sh """
DOCKER_BUILDKIT=1
docker build --pull \
-t \$IMAGE_PATH/${project}:${getBundleSuffix()} \
--build-arg GITHUB_SHA=${env.GIT_SHA} \
--build-arg BRANCH_NAME=${env.BRANCH_NAME} \
${project}
"""
    } else {
        sh "DOCKER_BUILDKIT=1 docker build ${project}"
    }
}

def pushDockerImage(String projects) {
    sh """
     for i in ${projects}; do \
        docker push --all-tags \$IMAGE_PATH/\$i; \
     done
"""
}

pipeline {
    options {
//     disableConcurrentBuilds();
        buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5'))
    }
    environment {
        CI = true
        GIT_SHA = "${sh(returnStdout: true, script: 'echo ${GIT_COMMIT} | cut -c1-12').trim()}"
        IMAGE_PATH = 'docker.rootscan.io/rootscan'
    }
    agent {
        node {
            label 'alpine1'
        }
    }
    stages {
        stage('Install') {
            parallel {
                stage('pnpm install') {
                    steps {
                        sh 'pnpm install --frozen-lockfile --unsafe-perm'
                    }
                }
                stage('Debug') {
                    steps {
                        sh 'node --version'
                        sh 'npm --version'
                        sh 'pnpm --version'
                        sh 'python --version'
                        sh 'pre-commit --version'
                        sh 'printenv'
                        script {
                            def branchName = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                            echo "The current branch name is: ${branchName}"
                            echo "GIT_SHA is: ${GIT_SHA}"
                        }
                    }
                }
                stage('Docker Login') {
                    steps {
                        withCredentials([usernamePassword(credentialsId: 'harbor-token', usernameVariable: 'HARBOR_ROBOT_USER', passwordVariable: 'HARBOR_ROBOT_USER_TOKEN')]) {
                            sh 'docker login -u "${HARBOR_ROBOT_USER}" --password "${HARBOR_ROBOT_USER_TOKEN}" ${IMAGE_PATH}'
                        }
                    }
                }
            }
        }
        stage('Build and Lint') {
            parallel {
                stage('block-explorer-indexer') {
                    steps {
                        script {
                            buildDockerImage('block-explorer-indexer')
                        }
                    }
                }
                stage('block-explorer') {
                    steps {
                        script {
                            buildDockerImage('block-explorer')
                        }
                    }
                }
            }
        }
        stage('Push') {
            when {
                expression {
                    return shouldBundle()
                }
            }
            parallel {
                stage('Push docker images') {
                    steps {
                        script {
                            pushDockerImage(PROJECTS)
                        }
                    }
                }
            }
        }
        stage('Deploy') {
            parallel {
                stage('dev') {
                    when {
                        anyOf {
                            branch 'dev'
                        }
                    }
                    steps {
                        script {
                            redeployProjects(APPS, 'rootscan-odev-porcini', '/project/local:p-cq7nh/workload/deployment')
                            redeployProjects(APPS, 'rootscan-odev-root', '/project/local:p-cq7nh/workload/deployment')
                            redeployProjects(APPS, 'rootscan-odevnet-porcini', '/project/local:p-cq7nh/workload/deployment')
                            redeployProjects(APPS, 'rootscan-odevnet-root', '/project/local:p-cq7nh/workload/deployment')
                        }
                    }
                }
                stage('prod') {
                    when {
                        anyOf {
                            branch 'prod'
                        }
                    }
                    steps {
                        script {
                            redeployProjects(APPS, 'rootscan-oprod-porcini', '/project/local:p-cq7nh/workload/deployment')
                            redeployProjects(APPS, 'rootscan-oprod-root', '/project/local:p-cq7nh/workload/deployment')
                        }
                    }
                }
            }
        }
    }
}
