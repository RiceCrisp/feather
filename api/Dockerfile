FROM node:18
WORKDIR /code
COPY package*.json ./
RUN npm install
# .dockerignore file omits node_modules directory from copy command
COPY ./ ./
EXPOSE ${API_PORT}
CMD ["npm", "run", "dev"]
