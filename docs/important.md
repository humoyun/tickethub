- In order to access cluster we need to setup either NodePort service or Ingress service (contains routing logic, handles incoming requests and routes to cluster's appropriate pod (service))

- whenever you stop/delete from cluster (when you stop `skaffold dev`) ingress we need to re-deploy again (https://kubernetes.github.io/ingress-nginx/deploy):

- run this command `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.44.0/deploy/static/provider/cloud/deploy.yaml`

- JWT_KEY is generated and maintained by kubernetes, it makes sure to make JWT_KEY available for pods in the form of env variables:

- cmd: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-very-secret-key`

- Load testing (TODO:): https://github.com/fortio/fortio

### Some concurrency issues

when we make many ticket creation (update) requests in parallel
events might possibly come out of order, here we use version-id to mitigate this problem
refer to OCC (Optimistic Concurrency Control)

requests => ticket-srv => ticket-db =>
=> emit event to NATS with same data => groupOfListeners => order-db (replica of tickets in order service)

some relevant links:

- https://jimmybogard.com/document-level-optimistic-concurrency-in-mongodb/

| Important note: increment the `version` number whenever the primary service responsible
| for a record emits an event to describe a create/update/destroy to a record
e.g. ticket-event versioning should only be controlled by Ticket service but not others
even they consume/utilize ticket-event

### Important note for unwanted versioning of tickets by order-events

when we make change orderId of ticket (create a new order for this ticket or cancel this order after it was created)
as part of our OCC mechanism, any updates to ticket will automatically update `version` of a ticket
so whenever we make any changes to ticket, we need to emit the event (with incremented version)
