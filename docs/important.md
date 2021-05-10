- In order to access cluster we need to setup either NodePort service or Ingress service (contains routing logic, handles incoming requests and routes to cluster's appropriate pod (service))

- whenever you stop/delete from cluster (when you stop `skaffold dev`) ingress we need to re-deploy again (https://kubernetes.github.io/ingress-nginx/deploy):

- run this command `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml`

- JWT_KEY is generated and maintained by kubernetes, it makes sure to make JWT_KEY available for pods in the form of env variables:

- cmd: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-very-secret-key`

- Load testing (TODO:): https://github.com/fortio/fortio
