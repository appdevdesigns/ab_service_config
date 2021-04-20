FROM node:13.5

RUN git clone https://github.com/Hiro-Nakamura/ab_service_config.git app && cd app && npm install

WORKDIR /app

CMD ["node", "--inspect", "app.js"]
