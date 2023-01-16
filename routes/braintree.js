const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require("node-fetch");
const auth = require('basic-auth');
const cache = require("./cache");
const moment = require("moment");

const braintree = require("braintree");


// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});

const creds = config.get("env.sandbox.rest.credentials.braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: creds.merchantId,
    publicKey: creds.publicKey,
    privateKey: creds.privateKey
});

router.get("/token", (req, res, next) => {

    gateway.clientToken.generate({}, (err, response) => {
        console.log('Braintree client token response: ', response);
        res.status(201).send(response);
      });
});

module.exports = router;