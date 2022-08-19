const config = require('config');
const base64 = require('base-64');
const fetch = require('node-fetch');

/**
 * We'll do async and return a promise in order to simplify for calling client.
 */
const getOauthToken = async (req) => {

    const creds = config.get("env.sandbox.rest.credentials");
    const baseURL = config.get("env.sandbox.rest.baseURL");

    // console.log('config: ', JSON.stringify(config, null, 4));

    const userPass = base64.encode(creds.clientId + ":" + creds.secret);
    const headers = {
        'Authorization': 'Basic ' + userPass,
        'Content-Type': 'application/x-www-form-urlencoded'
        // TODO:  GENERATE AUTH ASSERTION HEADER ON THE FLY
        // 'PayPal-Auth-Assertion': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJpc3MiOiJBU0VuWUlycmdrTTdhMVVwUTlYVy1qcks1SXktcy1sd1lGU2xvNXhNdlU2bEVLOXMyNGNXVUw1Q1dSSkJLaXJFSHNjblg1M2FvRXRWZmdRaiIsInBheWVyX2lkIjoiUTQ3WlRQTUI0UUhINiJ9.'
    };

    // do we have a valid oAuth client token?
    if (!req.session.oAuthToken) { // get and set the clientToken in session

        console.log('No access token found in session.  Retrieving now.');

        // fetch returns promise
        const response = await fetch(`${baseURL}/v1/oauth2/token`, {
            method: 'POST',
            headers: headers,
            body: 'grant_type=client_credentials'
        });

        if (response.ok) {
            // json conversion returns promise
            const oAuthToken = await response.json();

            // store in session and return value
            req.session.oAuthToken = oAuthToken;
            return oAuthToken;
        }
        else {
            class HTTPResponseError extends Error {
                constructor(response, ...args) {
                    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
                    this.response = response;
                }
            }

            throw new  HTTPResponseError(response);
        }


    }
    else { // validate the TTL, renew if necessary

        console.log(`Access token found in session, using cached value`);

        // TODO:  validate TTL

        // return value
        return req.session.oAuthToken;
    };

}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const buildAccessHeader = (req, res, next) => {

    getOauthToken(req).then((token) => {
        req.ppHeader = {
            "Authorization": "Bearer " + token.access_token.trim(),
            "Content-Type": "application/json",
            "Prefer": "return=representation",
            "PayPal-Request-Id": uuidv4()
        };
        next();
    });
}

module.exports = {
    getOauthToken,
    // getGrantValue,
    buildAccessHeader
};