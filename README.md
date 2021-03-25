## Tickethub: ticket ordering platform build on Microservices architecture
  Event based microservices

### TODOs:
 - Authentication with JWT
 - Authorization with AC rules
 - many more
 
### Functional features:
 - User signup/in
 - Ticket creation and listing
 - Placing order
 - Purchasing tickets


### Techs & languages & tools:
 - React
 - Next
 - Chakra UI
 - Skaffold
 - Kubernetes
 - Docker
 - Node
 - Express
 - MongoDB
 - PostgresSQL
 - Redis
 - NATS (Event Bus)
 - TypeScript
 - Golang
 - RESTful APIs
 - Postman




#### Seme remarks

JWT_KEY is generated and maintained by kubernetes, it makes sure to make JWT_KEY available for pods in the form of env variables
- cmd: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-very-secret-key`

express-async-errors: we need to handle error thrown by express, by default it handles sync route handlers (function), but in case of
we mark handler with async like: `async (res, req) = {}`, then the request just hangs, to fix this issue we used express-async-errors

 ### Useful resources:
 - [secure-web-app-http-headers](https://www.smashingmagazine.com/2017/04/secure-web-app-http-headers)
 - [intro-to-yaml-creating-a-kubernetes-deployment](https://www.mirantis.com/blog/introduction-to-yaml-creating-a-kubernetes-deployment)
 - [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress)