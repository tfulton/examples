const express = require('express');
const router = express.Router();
const config = require('config');
const fetch = require("node-fetch");
const auth = require('basic-auth');
const cache = require("./cache");
const moment = require("moment");

const Stripe = require('stripe');

// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});

const creds = config.get("env.sandbox.rest.credentials.stripe");

const stripe = new Stripe(creds.secretKey);

// Create Payment Intent
router.post('/payment-intent', (req, res, next) => {

    const body = req.body;
    console.log('BODY: ', JSON.stringify(body, null, 4));

    (async () => {

        // create and return payment intent info
        const json = await stripe.paymentIntents.create(body);

        // return non-error response
        console.log("Endpoint response json: ", json);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(json);
    })();

});

module.exports = router;