const DynamicsWebApiPrivate = require('dynamics-web-api');
const adal = require('adal-node')

function getApi(context) {
  const clientId = context.DYNAMICS_CLIENT_ID;
  const username = context.DYNAMICS_USERNAME;
  const password = context.DYNAMICS_PASSWORD;
  const tenantId = context.DYNAMICS_TENANT_ID
  const resource = context.DYNAMICS_HOST;
  
  // OAuth Token Endpoint
  const authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`
  const adalContext = new adal.AuthenticationContext(authorityUrl);

  function acquireToken(dynamicsWebApiCallback) {
    function adalCallback(error, token) {
      if (!error) {
        console.log('token retrieved:', token);
        dynamicsWebApiCallback(token);
      } else {
        console.log('token has not been retrieved: error:', error.stack);
      }
    }
  
    adalContext.acquireTokenWithUsernamePassword(
      resource, username, password, clientId, adalCallback
    );
  }
  
  return new DynamicsWebApiPrivate({
    webApiUrl: `${resource}/api/data/v9.0/`,
    onTokenRefresh: acquireToken
  });    
};

async function createIncident(dynamics, contactid, incidentData) {
  const data = {
    "customerid_contact@odata.bind": `/contacts(${contactid})`,
    ...incidentData
  };
  const id = await dynamics.create(data, "incidents");
  const request = {
    collection: "incidents",
    select: ["ticketnumber"],
    filter: "incidentid eq "+id,
    maxPageSize: 1,
    count: true
  };
  // TODO why is this fetching multiple with a query and not doing
  // a retrieve with the id?
  const response = await dynamics.retrieveMultipleRequest(request);
  const records = response.value;
  if (response.oDataCount == 1) {
    const incident = {
      'incidentId': id,
      'ticketNumber': records[0].ticketnumber
    };
    console.log('createCase: read new incident:', incident);
    return incident;
  }
  else {
    console.log('createCase: newly created incident not found???');
    return {};
  }
}

async function fetchContact(dynamics, phoneNum) {
  const tenDigitPhone = phoneNum.replace('+1', '');
  console.log(`findContact: tenDigitPhone = ${tenDigitPhone}`);
  const properties = ["contactid,firstname,lastname,telephone1,emailaddress1"];
  const filter = `telephone1 eq '${tenDigitPhone}'`;
  
  const response = await dynamics.retrieveMultiple("contacts", properties, filter);
  if (response.oDataCount === 0) {
    console.log('fetchContact: query returned 0 rows!');
    return {};
  }
  else {
    const row = response.value[0];
    console.log('fetchContact: contactid = ', row.contactid);
    return row;
  }
}

async function fetchProduct(dynamics, productName) {
  const properties = ["productid,name,description"];
  const filter = `name eq '${productName}'`;
  const response = await dynamics.retrieveMultiple("products", properties, filter);
  console.log('fetchProduct: response:', response);
  if (response.value.length === 0) {
    console.log('fetchProduct: query returned 0 rows!');
    return {};
  }
  else {
    const row = response.value[0];
    console.log('fetchProduct: productid = ', row.productid);
    return row;
  }
}

exports.getApi = getApi;
exports.createIncident = createIncident;
exports.fetchContact = fetchContact;
exports.fetchProduct = fetchProduct;
