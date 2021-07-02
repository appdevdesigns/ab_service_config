##
## digiserve/ab-config:master
##
## This is our microservice for our AppBuilder CRUD operations.
##
## Docker Commands:
## ---------------
## $ docker build -t digiserve/ab-config:master .
## $ docker push digiserve/ab-config:master
##
FROM digiserve/service-cli:master

RUN git clone --recursive https://github.com/appdevdesigns/ab_service_config.git app && cd app && npm install

WORKDIR /app

CMD ["node", "--inspect=0.0.0.0:9229", "app.js"]
