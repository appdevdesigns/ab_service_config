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
FROM digiserve/service-cli:develop

RUN git clone https://github.com/digi-serve/ab_service_config.git app && cd app && git checkout develop && npm install

WORKDIR /app

CMD ["node", "--inspect=0.0.0.0:9229", "app.js"]
