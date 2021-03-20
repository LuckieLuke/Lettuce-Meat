FROM node:13.12.0-alpine
WORKDIR /front/lettuce-meat

COPY ./front/lettuce-meat/package.json ./
COPY ./front/lettuce-meat/package-lock.json ./

COPY . .
RUN npm install @material-ui/core

CMD ["npm", "start"]