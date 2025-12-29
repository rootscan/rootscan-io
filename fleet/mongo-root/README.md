# Percona MongoDB Operator

Taken [from](https://docs.percona.com/percona-operator-for-mongodb/helm.html#prerequisites)

```shell
helm repo add percona https://percona.github.io/percona-helm-charts/
helm repo update
```

## Secrets

```shell
cat << EOF > minio-secrets.template.yaml
apiVersion: v1
kind: Secret
metadata:
  name: minio-secrets
type: Opaque
data:
  AWS_ACCESS_KEY_ID:
  AWS_SECRET_ACCESS_KEY:
EOF
```

```shell
kubeseal --context scprod -n rootscan-root-mongo -o yaml < minio-secrets.template.yaml > minio-secrets.yaml
```

Generate variables.yaml

```shell
helm --version 1.16.2 show values percona/psmdb-db > mongo.original.yaml
```

```shell
cp mongo.original.yaml mongo.yaml
```

## Install or upgrade

```shell
helm --version 1.16.2 --kube-context scprod -n rootscan-root-mongo upgrade --create-namespace --install rootscan-root-mongo percona/psmdb-db -f mongo.yaml
```

```shell
export MONGO_DATABASE_ADMIN=$(kubectl --context scprod get secret rootscan-root-mongo-p-secrets -n rootscan-root-mongo -o yaml -o jsonpath='{.data.MONGODB_DATABASE_ADMIN_USER}' | base64 --decode | tr '\n' ' ')
export MONGO_DATABASE_ADMIN_PASSWORD=$(kubectl --context scprod get secret rootscan-root-mongo-p-secrets -n rootscan-root-mongo -o yaml -o jsonpath='{.data.MONGODB_DATABASE_ADMIN_PASSWORD}' | base64 --decode | tr '\n' ' ')
export MONGO_USER_ADMIN=$(kubectl --context scprod get secret rootscan-root-mongo-p-secrets -n rootscan-root-mongo -o yaml -o jsonpath='{.data.MONGODB_USER_ADMIN_USER}' | base64 --decode | tr '\n' ' ')
export MONGO_USER_ADMIN_PASSWORD=$(kubectl --context scprod get secret rootscan-root-mongo-p-secrets -n rootscan-root-mongo -o yaml -o jsonpath='{.data.MONGODB_USER_ADMIN_PASSWORD}' | base64 --decode | tr '\n' ' ')
export MONGO_DATABASE="${MONGO_DATABASE_ADMIN}:${MONGO_DATABASE_ADMIN_PASSWORD}"
export MONGO_USER="${MONGO_USER_ADMIN}:${MONGO_USER_ADMIN_PASSWORD}"
echo "MONGO_DATABASE=${MONGO_DATABASE} MONGO_USER=${MONGO_USER}"
```

Next you need to connect to mongosh as MONGO_USER to create new user

```shell
kubectl --context scprod -n rootscan-root-mongo run -i --rm --tty percona-client \
  --image=percona/percona-server-mongodb:7.0.8-5-multi --restart=Never \
  -- mongosh "mongodb://${MONGO_USER}@rootscan-root-mongo-p-mongos.rootscan-root-mongo.svc.cluster.local/admin?ssl=false"
```

```text
db.createUser({
  user: "rootscan",
  pwd: "<PASSWORD>",
  roles: [
    { db: "root", role: "readWrite" }
  ],
  mechanisms: [
    "SCRAM-SHA-1"
  ]
});
```

To drop database

```shell
kubectl --context scprod -n rootscan-root-mongo run -i --rm --tty percona-client \
  --image=percona/percona-server-mongodb:7.0.8-5-multi --restart=Never \
  -- mongosh "mongodb://${MONGO_DATABASE}@rootscan-root-mongo-p-mongos.rootscan-root-mongo.svc.cluster.local/admin?&ssl=false"
```

```text
use <db>
db.dropDatabase({ w: 3, j: true, wtimeout: 60 })
```

## Delete

```text
helm --kube-context scprod -n rootscan-root-mongo delete rootscan-root-mongo
```

## Backups

## Troubleshooting

You can connect to operator and see if any error

```shell
kubectl --context scprod logs -n rootscan-root-mongo -l "app.kubernetes.io/name=psmdb-operator" --follow=true
```
