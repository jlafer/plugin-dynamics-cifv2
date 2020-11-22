const {corsResponse} = require('jlafer-twilio-runtime-util');

exports.handler = async function handler(context, event, callback) {
  const response = corsResponse();
  try {
    const {productName} = event;
    console.log(`findContact: productName = ${productName}`);
    const path = Runtime.getFunctions()['dynamicsWebApi'].path;
    const getApi = require(path);
    const dynamics = getApi(context);

    const properties = ["productid"];
    const filter = `name eq '${productName}'`;
    dynamics.retrieveMultiple("products", properties, filter)
    .then(records => {
      console.log('returning:', records.value[0]);
      response.appendHeader('Content-Type', 'application/json');
      response.setBody(records.value[0]);
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      response.setBody(error);
      callback(null, error);
    });
  } catch (err) {
    console.log('findProductByName: error caught:', err);
    callback(err);
  }
};