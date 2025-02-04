FROM node:22.7.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22.7.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
