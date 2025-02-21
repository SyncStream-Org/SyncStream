FROM node:22.7.0 AS build

WORKDIR /app

COPY server/package*.json server/
COPY sharedLib/package*.json sharedLib/

WORKDIR /app/server
RUN npm install

WORKDIR /app/sharedLib
RUN npm install

WORKDIR /app
COPY ./server ./server
COPY ./sharedLib ./sharedLib

WORKDIR /app/server
RUN npm run build

WORKDIR /app/sharedLib
RUN npm run build

FROM node:22.7.0

WORKDIR /app

COPY server/package*.json server/
COPY sharedLib/package*.json sharedLib/

WORKDIR /app/server
RUN npm install

WORKDIR /app/sharedLib
RUN npm install

WORKDIR /app

COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/sharedLib/dist ./sharedLib/dist

WORKDIR /app/server

EXPOSE 3000

CMD ["npm", "start"]
