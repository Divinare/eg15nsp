FROM ubuntu:14.04
RUN apt-get update && apt-get install -y npm nodejs-legacy
WORKDIR /data
COPY package.json /data/
RUN npm install
COPY . /data
CMD node app.js
EXPOSE 3000
ENV LANG C.UTF-8
