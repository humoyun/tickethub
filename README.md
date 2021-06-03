## Bay: ticket ordering platform build on Microservices architecture

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

#### Some remarks

JWT_KEY is generated and maintained by kubernetes, it makes sure to make JWT_KEY available for pods in the form of env variables

- cmd: `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=some-very-secret-key`

express-async-errors: we need to handle error thrown by express, by default it handles sync route handlers (function), but in case of we mark handler with async like: `async (res, req) = {}`, then the request just hangs, to fix this issue we used express-async-errors

### Useful resources:

- [secure-web-app-http-headers](https://www.smashingmagazine.com/2017/04/secure-web-app-http-headers)
- [intro-to-yaml-creating-a-kubernetes-deployment](https://www.mirantis.com/blog/introduction-to-yaml-creating-a-kubernetes-deployment)
- [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress)

### NextJS

in order to load/add global packages/styles/anything into all components that we need provide custom `_app.js`
add import all global packages inside it and if needed pass as props global options

Component is any file inside `/pages` (Next makes them into route-able pages)

https://github.com/vercel/next.js/blob/canary/errors/css-global.md

```
function _app({ Component, pageProps }) {
  return  <Component props={...pageProps} />
}
```

- When use SSR then we can only use `cookies` as Auth mechanism as in the initial render happens inside Server
  and we don't have javascript in browser when type `somedomain.com` into browser tab, so we can set neither request body (sending Auth token as part of body) nor we can set Authorization header, whereas, in typical SPA app (React)
  we can do this:

| Options     | Cookie | Authorization header | Request body |
| ----------- | ------ | -------------------- | ------------ |
| SSR (Next)  | true   | false                | false        |
| SPA (React) | true   | true                 | true         |

TODO: use custom `Formik` in `codesandbox` in next client app

### Error when NextJS run inside docker (Kubernetes)

We get some strange error when deploy NextJS app inside Kubernetes cluster, specifically,
when we call `getInitialProps` we can TCP `connect ECONNREFUSED 127.0.0.1:80 error`

`https://stackoverflow.com/questions/55617722/nextjs-getinitialprops-not-working-with-nginx`

#### Some gotcha of getInitialProps:

getInitialProps almost always executed in Server in initial rendering but:
`getInitialProps` can be executed from browser in some particular cases, which is when
navigating from one page to another `while in the app`

### from official docs:

For the initial page load, getInitialProps will run on the server only. getInitialProps will then run on the client when navigating to a different route via the next/link component or by using next/router. However, if getInitialProps is used in a custom \_app.js, and the page being navigated to implements getServerSideProps, then getInitialProps will run on the server.

#### Cross Namespace Service Communication

`kubectl get services -n ingress-nginx` to find the correct service name for your specific Kubernetes provider.

when making `request` from Pod(container) namespace (but actual `request` is originated from browser into NextJS app) to another container in another namespace or ingress-nginx inside k8s cluster we need pass by all headers to another container in another namespace,
especially `Host` and `cookie`

NextJS -> Cluster[ingres-nginx -> next-js-pod -> ingress-nginx -> auth-app-in-another-pod]

### Global signup method for only testing purposes

```
  global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const resp = await request(app).
  post('/api/users/signup').
  send({email, password}).
  expect(201);

  const cookie = resp.get('Set-Cookie');

  return cookie;
}
```

## TODO: Mocking databases MongoDB in tests instead of using real mongodb connection

## TODO: Test OCC related cases in orders/tests/test-script-to-check-occ.ts
