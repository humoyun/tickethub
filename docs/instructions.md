
## Some useful docker commands
### Stop all running containers
 - docker stop $(docker ps -aq)
### Remove all stopped containers
 - docker rm $(docker ps -aq)
### Remove all images
  - docker rmi $(docker images -q)