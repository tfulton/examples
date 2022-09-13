const express = require('express');
const router = express.Router();
const config = require('config');


// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});


const baseURL = config.get("env.sandbox.rest.adyen.baseURL");
const creds = config.get("env.sandbox.rest.credentials.adyen");

// Payment Session endpoint
router.post("/session", (req, res) => {

    const body = req.body;
    console.log('BODY: ', JSON.stringify(body, null, 4));

    const url = baseURL + '/v68/sessions';

    (async () => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-API-key": creds.apiKey
            },
            body: JSON.stringify(body)
        });
        const json = await response.json();

        // // handle error response
        // if (response.status !== 200) {
        //     res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.')));
        // }

        // return non-error response
        console.log("Endpoint response json: ", json);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(json);
    })();
});

// receive a payload and send on to the adyen payment endpoint
router.post('/payment', (req, res) => {

    const body = req.body;
    console.log('BODY: ', JSON.stringify(body, null, 4));

    const url = baseURL + '/v68/payments';

    let payload = {
        merchantAccount: "BrittoECOM",
        reference: "ref_{{uuid}}",
        amount: {
            value: 10,
            currency: "EUR"
        },
        paymentMethod: body.paymentMethod,
        browserInfo: body.browserInfo
    };

    (async () => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-API-key": creds.apiKey
            },
            body: JSON.stringify(payload)
        });
        const json = await response.json();

        // // handle error response
        // if (response.status !== 200) {
        //     res.status(400).send(JSON.stringify(new Error('Message rejected by endpoint.')));
        // }

        // return non-error response
        console.log("Endpoint response json: ", json);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).send(json);
    })();

});

module.exports = router;