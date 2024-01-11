class PaymentRequest {
    constructor(reference, amount, currencyCode = 'AUD', oneTimeToken) {
        this.reference = reference;
        this.payment = {
            amount,
            currencyCode,
            instrument: {
                oneTimeToken: {
                    id: oneTimeToken
                }
            }
        };
    }
} 
  
class PaymentResponse {
    constructor(data) {
        this.reference = data.reference || '';
        this.id = data.id || '';
        this.payment = {
            amount: data.payment && data.payment.amount ? data.payment.amount : 0,
            currencyCode: data.payment && data.payment.currencyCode ? data.payment.currencyCode : '',
            instrument: {
                card: {
                name: data.payment && data.payment.instrument && data.payment.instrument.card && data.payment.instrument.card.name
                    ? data.payment.instrument.card.name : '',
                last4: data.payment && data.payment.instrument && data.payment.instrument.card && data.payment.instrument.card.last4
                    ? data.payment.instrument.card.last4 : '',
                expiryMonth: data.payment && data.payment.instrument && data.payment.instrument.card && data.payment.instrument.card.expiryMonth
                    ? data.payment.instrument.card.expiryMonth : '',
                expiryYear: data.payment && data.payment.instrument && data.payment.instrument.card && data.payment.instrument.card.expiryYear
                    ? data.payment.instrument.card.expiryYear : '',
                cardType: data.payment && data.payment.instrument && data.payment.instrument.card && data.payment.instrument.card.cardType
                    ? data.payment.instrument.card.cardType : '',
                }
            }
        };
        this.createdDateTime = data.createdDateTime || '';
        this.updatedDateTime = data.updatedDateTime || '';
        this.result = {
            status: data.result && data.result.status ? data.result.status : '',
            codes: data.result && data.result.codes ? data.result.codes : []
        };
    }
}
  
module.exports = {
    PaymentRequest,
    PaymentResponse
}
  
  

  