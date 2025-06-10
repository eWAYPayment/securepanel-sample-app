const axios = require('axios');
const randomstring = require('randomstring');
const { TokensRequest, TokensResponse } = require('../model/tokens');
const { PaymentRequest, PaymentResponse } = require('../model/transaction');
const config = require('config');

const createShoppingCartObj = (req, token) => ({
  price: req.body.price,
  quantity: req.body.quantity,
  surcharge: 0,
  oneTimeToken: token,
  surchargeEnabled: req.body.surchargeEnabled,
  securePanelUrl: config.securePanelUrl,
});

const getTokens = async () => {
  const tokensRequest = new TokensRequest('securepanel');
  const headers = {
    'x-api-key': global.xApiKey,
  };
  console.log("Create OneTimeToken request Start with RequestBody: " + JSON.stringify(tokensRequest));
  try {
    const response = await axios.post(`${config.singleApiBaseUrl}/tokens`, tokensRequest, { headers });
    console.log("Create OneTimeToken request finished with ResponseBody: " + JSON.stringify(response.data));
    return new TokensResponse(response.data);
  } catch (error) {
    console.log("An Error occurred during create transaction request with: " + error);
    throw error;
  }
};

const renderShoppingCart = async (req, res) => {
  try {
    const tokensResponse = await getTokens();
    const shoppingCartObj = createShoppingCartObj(req, tokensResponse.token);
    const nonce = res.locals.nonce;
    res.render('shoppingCart', { shoppingCartObj, nonce });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTransaction = async (req, res) => {
  const amount = req.body.price * 100 * req.body.quantity;
  const paymentRequest = new PaymentRequest(randomstring.generate(35), amount, 'AUD', req.body.oneTimeToken);
  const headers = {
    'x-api-key': global.xApiKey,
    'x-idempotency-key': randomstring.generate(35),
  };
  const xApiKey = global.xApiKey;
  console.log("The length of the API Key is: " + xApiKey.length);
  console.log("The first 6 of API Key is: " + xApiKey.substring(0, 6) +
    " The last 4 of API Key is: " + xApiKey.substring(xApiKey.length - 4, xApiKey.length));
  console.log("Create transaction request start with RequestBody: " + JSON.stringify(paymentRequest));

  try {
    const response = await axios.post(`${config.singleApiBaseUrl}/transactions`, paymentRequest, { headers });
    const paymentResponse = new PaymentResponse(response.data);
    console.log("Create transaction request finished with ResponseBody: " + JSON.stringify(paymentResponse));
    res.render('response', { paymentResponse });
  } catch (error) {
    console.log("An Error occurred during create transaction request with: " + JSON.stringify(error));
    var errorMessage = "Unknown Error";
    if (error.response != undefined) {
      errorMessage = error.response.status
    }
    res.render('response', { paymentResponse: { errorMessage } });
  }
};

module.exports = {
  renderShoppingCart,
  createTransaction,
};