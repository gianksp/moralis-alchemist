FROM nikolaik/python-nodejs:python3.8-nodejs14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN wget -O erdpy-up.py https://raw.githubusercontent.com/ElrondNetwork/elrond-sdk/master/erdpy-up.py

RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker sudo

RUN whoami
USER docker
RUN whoami

RUN python3 --version
RUN python erdpy-up.py
ENV PATH "$PATH:/home/docker/elrondsdk"
RUN /bin/bash -c "ls"
RUN /bin/bash -c "source erdpy-activate"
RUN erdpy
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]