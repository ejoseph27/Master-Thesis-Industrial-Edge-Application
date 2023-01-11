
# Define ubuntu version
FROM eniocarboni/docker-ubuntu-systemd:latest
RUN echo "elvis"
#FROM teracy/ubuntu:20.04-dind-19.03.15
#Install node components
RUN apt-get update -y
RUN apt-get install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
#...................MIGHT  HAVE TO DELETE..............
# install docker in container

RUN apt-get update && \
    apt-get -qy full-upgrade && \
    apt-get install -qy curl && \
    curl -sSL https://get.docker.com/ | sh


# Define container directory
WORKDIR /usr/src/app

#Copy package*.json #for npm install

COPY ./backend/package*.json ./
#Run npm clean install, prod dependencies only
RUN npm ci --only=production
# Copy all files
COPY ./backend/. .
RUN install iectl /usr/bin/
# Expose port 3000 for server
EXPOSE 3000
#Run "node index.js"
CMD ["node","index.js"]
