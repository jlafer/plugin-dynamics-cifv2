/*
  createCase.js
  Creates an incident object (displayed as a Case) for the contact specified.
  Input parameters:
    contact_id
    productName
*/
const {corsResponse} = require('jlafer-twilio-runtime-util');
let helpersPath = Runtime.getFunctions()['dynamicsHelpers'].path;
let helpers = require(helpersPath);

exports.handler = async function(context, event, callback) {
  const response = corsResponse();
  try {
    const path = Runtime.getFunctions()['dynamicsWebApi'].path;
    const getApi = require(path);
    const dynamics = getApi(context);
    const {contact_id: contactid, productName} = event;
    console.log(`createCase: contactid = ${contactid}`);
    console.log(`createCase: productName = ${productName}`);
    const product = await helpers.fetchProduct(dynamics, productName);
    // TODO move data spec to caller
    const incidentData = {
      "caseorigincode": 1,            // 1 = Phone
      "casetypecode": 3,              // 3 = Request
      "title": "Assistance with Card Renewal",
      "description": "Customer requested assistance with transit card renewal",
      "subjectid": {
        title: "Payment Card *2355, Expires: 12/2020"
      },
      "productid@odata.bind": `/products(${product.productid})`
    };
    const incident = await helpers.createIncident(dynamics, contactid, incidentData);
    response.appendHeader('Content-Type', 'application/json');
    response.setBody(incident);
    callback(null, response);
  } catch (err) {
    console.log('createCase: threw error:', err.stack);
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody(err.message);
    callback(null, response);
  }
};