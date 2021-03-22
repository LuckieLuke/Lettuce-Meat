FROM node:13.12.0
WORKDIR /front/lettuce-meat

COPY ./front/lettuce-meat/package.json ./
COPY ./front/lettuce-meat/package-lock.json ./

COPY . .

CMD ["npm", "start"]