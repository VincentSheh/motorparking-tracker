FROM node:18

WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 3000
# This run the server at default port 3000
CMD ["yarn", "run", "start"]