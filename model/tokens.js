class TokensRequest {
    constructor(scope) {
        this.scope = scope;
    }
}

class TokensResponse {
    constructor(data) {
        this.token = data.token || '';
        this.tokenType = data.tokenType || '';
        this.scope = data.scope || '';
        this.expiryDateTime = data.expiryDateTime || '';
        this.result = {
            status: data.result && data.result.status ? data.result.status : ''
        };
    }
}

module.exports = {
    TokensRequest,
    TokensResponse
};
