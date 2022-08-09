class ResponseInfo {
    constructor(type, url, request, response) {
        this.type = type;
        this.url = url;
        this.request = request;
        this.response = response;
    }
}

module.exports = {
    ResponseInfo
}