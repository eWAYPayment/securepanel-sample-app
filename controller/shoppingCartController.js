const axios = require('axios');
const randomstring = require('randomstring');
const { TokensRequest, TokensResponse } = require('../model/tokens');
const { PaymentRequest, PaymentResponse } = require('../model/transaction');
const config = require('config');

const createShoppingCartObj = (req, token) => ({
  price: req.query.price,
  quantity: req.query.quantity,
  oneTimeToken: token,
  securePanelUrl: config.securePanelUrl,
});

const getTokens = async () => {
  const tokensRequest = new TokensRequest('securepanel');
  const headers = {
    'x-api-key': global.xApiKey,
  };

  try {
    const response = await axios.post(`${config.singleApiBaseUrl}/tokens`, tokensRequest, { headers });
    return new TokensResponse(response.data);
  } catch (error) {
    throw error;
  }
};

const renderShoppingCart = async (req, res) => {
  try {
    const tokensResponse = await getTokens();
    const shoppingCartObj = createShoppingCartObj(req, tokensResponse.token);
    res.render('shoppingCart', { shoppingCartObj });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createTransaction = async (req, res) => {
  const amount = parseFloat(req.body.amount) * 100;
  const paymentRequest = new PaymentRequest(randomstring.generate(35), amount, 'AUD', req.body.oneTimeToken);
  const headers = {
    'x-api-key': global.xApiKey,
    'x-idempotency-key': randomstring.generate(35),
  };

  try {
    const response = await axios.post(`${config.singleApiBaseUrl}/transactions`, paymentRequest, { headers });
    const paymentResponse = new PaymentResponse(response.data);
        res.render('response', { paymentResponse });
  } catch (error) {
        const result = error.response.data.result;
        res.render('response', { paymentResponse: { result } });
  }
};

module.exports = {
  renderShoppingCart,
  createTransaction,
};