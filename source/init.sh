#!/bin/bash

# kill previously running node app on port
lsof -t -i tcp:3001 | xargs kill -9

# install dependencies
npm install --prefix ~/website/source ~/website/source/

# start up express server
npm start --prefix ~/website/source/ &