# NODE LTS
FROM node:16.1-alpine

# Establish environment variables
ENV USER=me
ENV HOME=/home/$USER
ENV TZ="Australia/Sydney"

# Create non-root user
RUN adduser --disabled-password --shell /bin/false $USER
USER $USER
RUN mkdir $HOME/app
WORKDIR $HOME/app/

# Install dependencies
COPY ./package.json $HOME/app/
RUN npm install --production

# Copy app to image
COPY . $HOME/app/

CMD [ "node", "lib/index" ]
