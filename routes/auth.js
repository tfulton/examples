const express = require('express');
const router = express.Router();
const authUtils = require('./authUtils');

// return the full value of the oAuth grant response
router.get('/', function (req, res, next) {
    authUtils.getGrantValue().then(function (results) {
        console.log("Returning the oAuth response: ", results);
        res.status(200).send(JSON.stringify(results, null, 4));
    })
        .catch(function (error) {
            res.status(500).render('error', { message: "Unexpected error.", error: error });
        });
});

module.exports = router;