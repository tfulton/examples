/**
 * Main client that handles initialization and authorization.  Also factory of sorts
 * for specific functional modules.
 * 
 * @param {String} token 
 * @returns 
 */
function client(token = null) {
    
    if (!token) {
        throw new TypeError("Token invalid or null.");
    }
    else if (token && typeof token != 'object') {
        throw new TypeError("Token must be object.");
    }
    else if (!token.authorization) {
        throw new TypeError("Token missing authorization property.");
    }
    
    return new Promise((res, rej) => {
        res(new ClientInstance(token.authorization));
    })
}

class ClientInstance {

    constructor (authorization) {
        this.authorization = authorization;
    }
}

const paypal = {
    client: client
}

export {paypal, ClientInstance};