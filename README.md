# hues-n-queues

Multiplayer browser game with inspiration from Hues and Cues.

## Setup dev environment

Download Docker Desktop  
Open up repo and make a new branch  
Clone repo into local folder  
Open it in VS Code  
Navigate to root folder  
In terminal run `docker compose up`  
This builds image and starts a container

When done use `docker compose down`  
This stops the active containers

Full reset if things get messed up:  
`docker compose down --volumes --remove-orphans`  
`docker compose build --no-cache`  
`docker compose up`

When making commits and pushing make sure you're not on the main branch  
Check using `git branch`  
Current branch will have a \* next to it
