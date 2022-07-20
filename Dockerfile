##
## digiserve/ab-config:develop
##
## This is our microservice for our AppBuilder CRUD operations.
##
## Docker Commands:
## ---------------
## $ docker build -t digiserve/ab-config:develop .
## $ docker push digiserve/ab-config:develop
##

ARG BRANCH=master

FROM digiserve/service-cli:${BRANCH}

COPY . /app

WORKDIR /app

RUN npm i -f

WORKDIR /app

CMD ["node", "--inspect=0.0.0.0:9229", "app.js"]
