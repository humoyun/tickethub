## Some useful docker commands

### Stop all running containers

- docker stop $(docker ps -aq)

### Remove all stopped containers

- docker rm $(docker ps -aq)

### Remove all images

- docker rmi $(docker images -q)

### enter into pod

- `kubectl get pods` get a list of pods, choose the one you want to enter
- `kubectl exec -it name-of-pod sh`
