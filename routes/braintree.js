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

router.post("/authorize", (req, res, next) => {

    const body = req.body;
    console.log('BODY: ', JSON.stringify(body, null, 4));

    (async () => {

        gateway.transaction.sale(
            body
        )
        .then(result => {
            console.log('Result: ', result);
            if(result.success) {
                res.status(201).send(result);
            }
            else {
                res.status(400).send(result);
            }
        })
        .catch(error => {
            console.log('Error in gateway response: ', error);
            res.status(500).send(error);
        });
    })();

});


router.post("/:transactionId/capture", (req, res, next) => {

    const body = req.body;
    console.log('BODY: ', JSON.stringify(body, null, 4));
    
    const id = req.params.transactionId;
    console.log('Transaction ID: ', id);

    const amount = req.body.amount;
    console.log('Transaction Amouint: ', amount);

    (async () => {
        gateway.transaction.submitForSettlement(id,amount)
        .then(result => {
            console.log('Result: ', result);
            if(result.success) {
                res.status(201).send(result);
            }
            else {
                res.status(400).send(result);
            }
        })
        .catch(error => {
            console.log('Error in gateway response: ', error);
            res.status(500).send(error);
        });
    })();
});

router.get("/:transactionId", (req, res, next) => {

});

module.exports = router;