const DynamicsWebApiPrivate = require('dynamics-web-api');
const adal = require('adal-node')

module.exports = function getApi(context) {
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
        dynamicsWebApiCallback(token);
      } else {
        console.log('Token has not been retrieved. Error: ' + error.stack);
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
