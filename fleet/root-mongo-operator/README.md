# Percona MongoDB Operator

[documentation](https://docs.percona.com/percona-operator-for-mongodb/helm.html#prerequisites)

Percona Operator used to do everything:

- create multinode cluster
- backup
- restarts

Percona operator can monitor single namespace or multiple, I will prefer single as it's easier to investigate errors

## Setup

```shell
helm repo add percona https://percona.github.io/percona-helm-charts/
helm repo update percona
```

To check new version

```shell
helm search repo percona
```

Generate variables.yaml

```shell
helm --version 1.16.2 show values percona/psmdb-operator > percona-mongo.template.yaml
```

## Status

```shell
kubectl --context scprod get psmdb -n rootscan-root-mongo
```
