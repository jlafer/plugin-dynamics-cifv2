/*
  This is an example Twilio Serverless module for calling the Microsoft
  Dynamics 365 / Dataverse API. It provides some helper functions that can be
  called from other serverless functions. See 'createCase.protected.js' for
  an example.

  NOTE: this module makes use of the open-source library 'dynamics-web-api' for
    NodeJS. See https://www.npmjs.com/package/dynamics-web-api for details.
    This library handles much of the complexity of calling the Dynamics API.
  
  See https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api
  for documentation on the underlying Dynamics 365 / Dataverse API that is used
  for working with Dynamics entities.

  This module relies on a set of environment variables. They can be set
  in a .env file within your Serverless project folder.
    ACCOUNT_SID - the Account SID of the Twilio Flex project.
    AUTH_TOKEN - This is the authorization token of the Twilio Flex project.
    DYNAMICS_CLIENT_ID - This is your Dynamics 365 Client ID.
    DYNAMICS_TENANT_ID - This is your Office365/Azure tenant ID. It can be
      located by going to azure.portal.com, selecting 'Azure Active Directory',
      click on 'Properties' under the 'Manage' section. It's labeled 'Directory ID'.
    DYNAMICS_USERNAME - This is a username for a user that has been granted API
      access to Dynamics 365.
    DYNAMICS_PASSWORD - This is the user's password.
    DYNAMICS_HOST - This is the URL of your Dynamics organization and will be
      of the form: https://my-org.crm.dynamics.com.

  Notes:
  - You must "Enable ACCOUNT_SID and AUTH_TOKEN" in the Twilio Serverless
    console to authorize access by this module to your Twilio credentials.
*/
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
  if (response.value.length == 1) {
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
  const properties = ["contactid,firstname,lastname,telephone1,emailaddress1"];
  const filter = `telephone1 eq '${tenDigitPhone}'`;
  
  const response = await dynamics.retrieveMultiple("contacts", properties, filter);
  if (response.value.length === 0) {
    console.log('fetchContact: query returned 0 rows!');
    return {};
  }
  else {
    const row = response.value[0];
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
