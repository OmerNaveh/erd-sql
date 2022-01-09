# Two days Nodejs SQL drill

- The task today is to develop a backend which will communicate with mysql db.
- We will manipulate the database through server endpoints.
- Before you approach the task, stop and think about what the different tables in the database will look like and how they will communicate with each other.

## Before jumping to work:

- Look at the template you received and understand how the connection between the server and the database is made.
- See the basic functionality and rewrite the code to fit the requirements below:

## Task:

### Please build an `ERD` for the senior class at the school where you attended:

### Minimum requirements:

1. Contain the following tables:

- Teachers
- Pupils
- Subjects
- Classes

2. Think about the following when creating your ERD:

- A teacher can teach a number of Subjects.
- A Pupil can learn a number of Subjects.
- A Pupil can only be associated with one class.
- One class contains several Pupils.

## EndPoints:

### GETS

- GET /:teacherID
- GET /:classID
- GET /:pupilID
- GET /:classID
- Will reply with information about the specific object

### POSTS

- POST /new/pupil
- POST /new/teacher
- Will create a new object at the correct table with information in the `req.body`

### PUTS

- PUT /update/pupil/:pupilID
- PUT /update/class/:classID
- Will update the object at the correct table with information in the `req.body`

### DELETS

- DELETE /remove/pupil/:pupilID
- DELETE /remove/teacher/:teacher
- Will delete the object at the correct table.

## Preparation of the work environment:

### Build image:

    docker build -t node-api:v1 .

### create network

    docker network create node-api-network

### Start MYSQL:

    docker run \
    --rm \
    -d \
    --name mysql_server \
    -e MYSQL_DATABASE='test_db' \
    -e MYSQL_USER='root' \
    -e MYSQL_PASSWORD='secret' \
    -e MYSQL_ROOT_PASSWORD='secret' \
    --network node-api-network \
    mysql:8.0

### Start node-api

    docker run \
    --rm \
    --name node-app \
    --network node-api-network \
    -p 3000:3000 \
    -v $(pwd):/app \
    node-api:v1

### Stop running container using

    docker stop node-app
    docker stop mysql_server

### or start using

    docker-compose up

### and stop using

    docker-compose down

## Resources:

- [ERD Templates](https://online.visual-paradigm.com/diagrams/templates/entity-relationship-diagram/)
