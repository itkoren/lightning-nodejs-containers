## An Overview of NodeJS as a LightWeight Container

A [session](http://itkoren.github.io/lightning-nodejs-containers/) I gave to Technical Leaders @LivePerson

## Prerequisites

1. [Download and install](https://nodejs.org/en/download/ "Download NodeJS") the current version of NodeJS on your machine.
2. Open Terminal/Command Prompt and type:

     ```
     node -v
     ```
   Output should be equal to current node version

     ```
     npm -v
     ```
   Output should be equal to current npm version
3. Install n - a version manager for NodeJS - globally on your machine

     ```
     npm install n -g
     ```
4. Install NodeJS stable version via n

     ```
     n stable
     ```

#####*If you've completed all the above - You are ready to Node!!!*

## Step 1
 - Checkout Step 1 - Open Terminal/Command Prompt and type

      ```
      git clone https://github.com/itkoren/lightning-nodejs-containers.git
      cd lightning-nodejs-containers
      git checkout step1
      ```
 - Run Sample:

      ```
      npm start
      ```

## Step 2
 - Open Terminal/Command Prompt and type

      ```
      npm install express-generator -g
      cd ..
      express demo
      cd demo
      npm install
      DEBUG=demo:* npm start
      ```
 - Checkout Step 2 - Open Terminal/Command Prompt and type

       ```
       cd ../lightning-nodejs-containers
       git checkout step2
       ```
 - Run Sample:

       ```
       npm install
       npm start
       ```
 - Look at routes/index.js, services/message-service.js

## Step 3
 - Checkout Step 3 - Open Terminal/Command Prompt and type

       ```
       git checkout step3
       ```
 - Run Sample:

       ```
       npm install
       npm start
       ```
 - Look at package.json, bin/www

## Step 4
 - Open Terminal/Command Prompt and type

       ```
       npm install lp_js_service_status --save
       ```
 - Create a new file at lib/service-status.js
 - Copy the following code to this file:

       ```
       var service_status = require('lp_js_service_status');
       var pkg = require('../package.json');
       var cfg = {
          port: 4888,
          logger: console,
          pckJson: pkg
       };

       service_status.init(cfg);

       module.exports = {
           messages: service_status.metrics.addMetric({ name: 'Messages', type: 'Counter' });
           rps: service_status.metrics.addMetric({ name: 'RPS', type: 'Meter' });
       };
       ```
 - Open services/message-service.js and add:

       ```
       var serviceStatus = require('../lib/service-status');

       // Inside addMessage
       serviceStatus.messages.inc();

       // Inside deleteMessage
       serviceStatus.messages.dec();
       ```
 - Open routes/index.js and add:

       ```
       var serviceStatus = require('../lib/service-status');

       // Inside all routes
       serviceStatus.rps.mark();
       ```

## Step 5
 - Open Terminal/Command Prompt and type

       ```
       npm install yo -g
       ```
 - Install LivePerson's NodeJS Project generator

       ```
       npm install generator-lpnodejs -g
       ```
 - Create a new directory, and cd into it

       ```
       mkdir lp-demo && cd $_
       ```
 - Use the generator to create your skeleton

       ```
       yo lpnodejs
       ```
