const express = require('express');
const router = express.Router();
const config = require('config');
const authUtils = require('./authUtils');
const fetch = require('node-fetch');

// constants
const baseURL = config.get("env.sandbox.rest.baseURL");

// do some initial prep
router.use(function (req, res, next) {
    console.log("Handling URL: " + req.originalUrl + ' ' + req.method);
    next();
});
router.use(authUtils.buildAccessHeader);

/**
 * Generate a client token for a given customer id.
 */
router.get('/data-client-token/:customerId', (req, resp) => {

    // retrieve a 'client token' for the UI to use
    const url = `${baseURL}/v1/identity/generate-token`;
    console.log(`url: ${url}`);

    // console.log(`header: ${JSON.stringify(req.ppHeader, null, 4)}`);

    const body = {
        customer_id: req.params.customerId
    }

    console.log(`creating identity token with body: ${JSON.stringify(body, null, 4)}`);

    fetch(url, {
        method: 'POST',
        headers: req.ppHeader,
        body: JSON.stringify(body)
    })
        .then((response) => {
            // console.log(`Response status from identity endpoint for client token: ${response.status}`);
            // console.log(`Response status text from identity endpoint for client token: ${response.statusText}`);
            return response.json();
        })
        .then(json => {
            resp.setHeader('Content-Type', 'application/json');
            resp.status(201).send(JSON.stringify(json));
        })
        .catch(error => {
            console.error(`Error retrieving client token from identity endpoint.`);
            resp.status(400).send(JSON.stringify(error));
        });
});

/**
 * Generate a client token without a customer id.
 */
router.get('/data-client-token', (req, resp) => {

    // retrieve a 'client token' for the UI to use
    const url = `${baseURL}/v1/identity/generate-token`;
    console.log(`Identity url: ${url}`);
    console.log(`PP Headers: ${JSON.stringify(req.ppHeader)}`);

    fetch(url, {
        method: 'POST',
        headers: req.ppHeader,
        // body: JSON.stringify(body)
    })
        .then((response) => {
            console.log(`Response status from identity endpoint for client token: ${response.status}`);
            console.log(`Response status text from identity endpoint for client token: ${response.statusText}`);
            return response.json();
        })
        .then(json => {
            resp.setHeader('Content-Type', 'application/json');
            resp.status(201).send(JSON.stringify(json));
        })
        .catch(error => {
            console.error(`Error retrieving client token from identity endpoint.`);
            resp.status(400).send(JSON.stringify(error));
        });
});

router.get('/data-client-token/:customerId', (req, resp) => {

    // retrieve a 'client token' for the UI to use
    const baseURL = config.get("env.sandbox.rest.baseURL");
    const url = `${baseURL}/v1/identity/generate-token`;
    console.log(`url: ${url}`);

    const header = req.ppHeader;
    console.log(`header: ${JSON.stringify(header, null, 4)}`);

    const body = {
        customer_id: req.params.customerId
    }
    console.log(`body: ${JSON.stringify(body, null, 4)}`);

    fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
    })
        .then((response) => {
            console.log(`Response status from identity endpoint for client token: ${response.status}`);
            console.log(`Response status text from identity endpoint for client token: ${response.statusText}`);
            return response.json();
        })
        .then(json => {
            resp.setHeader('Content-Type', 'application/json');
            resp.status(201).send(JSON.stringify(json));
        })
        .catch(error => {
            console.error(`Error retrieving client token from identity endpoint.`);
            resp.status(400).send(JSON.stringify(error));
        });
});

/**
 * Retrieve an oAuth token containing our access token
 */
router.get('/access-token', async (req, resp) => {

    let token = await authUtils.getOauthToken(req);
    resp.status(200).send(token.access_token.trim());

});

module.exports = router;