#### Some remarks

express-async-errors: we need to handle error thrown by express, by default it handles sync route handlers (function), but in case of
we mark handler with async like: `async (res, req) = {}`, then the request just hangs, to fix this issue we used express-async-errors

### Testing issues

- https://github.com/visionmedia/supertest/issues/336
- https://github.com/cszatmary/jest-supertest-cookie-fix

### Node js related issues

- https://stackoverflow.com/questions/16995184/nodejs-what-does-socket-hang-up-actually-mean

#### Should be careful when using this new v1.

Using the new version `networking.k8s.io/v1` is recommended, but when you follow lecture 118 - build and deploy our app to Google Cloud ,this will fail with the following error

- stderr: "error: unable to recognize
  ticketing\\\\infra\\\\k8s\\\\ingress-srv.yaml\": no matches for kind \"Ingress\" in version \"networking.k8s.io/v1\"\n"
- cause: exit status 1
  The reason for this error is that, at the moment Google Cloud's latest Kubernetes version is v1.18.12 while in order to use networking.k8s.io/v1 we need v1.19+

$ kubectl version --short
Client Version: v1.19.3
Server Version: v1.18.12-gke.1210
Reference: https://github.com/kubernetes/kubernetes/issues/90077

My local machine is installed with v1.19.3, so it can support networking.k8s.io/v1. But when deploying the app to Google Cloud using Skaffold, I need to change back to v1beta1
