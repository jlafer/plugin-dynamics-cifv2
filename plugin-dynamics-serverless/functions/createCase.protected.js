/*
  createCase
  Creates an incident object (displayed as a Case) for the contact specified.
  
  Required input parameters:
    contactid - the Contact id
    title - will generate a new Subject object with the given title
    caseorigincode - (1=phone, 2=email, 3=web, see docs for others)
    casetypecode - (1=question, 2=problem, 3=request)
  Optional input parameters:
    productName - (optional) the name of an existing, active product in the Sales Hub
    description - (optional) a case description string
    subject - (optional) a case subject line
  Additional valid incident properties, if supplied, will be submitted. These are
  documented at https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/incident?view=dynamics-ce-odata-9.

  NOTE: if string parameters need URL-encoding, this can be done in Studio using
    liquid like this: {{ widgets.fnDataDip.parsed.suspectStr | url_encode }}
    Such an input parameter will need decoding as done below with title, subject, etc.
*/
const {corsResponse} = require('jlafer-twilio-runtime-util');
let helpersPath = Runtime.getFunctions()['dynamicsHelpers'].path;
let helpers = require(helpersPath);

exports.handler = async function(context, event, callback) {
  console.log(`createCase: event:`, event);
  const response = corsResponse();
  try {
    const dynamics = helpers.getApi(context);
    const {
      contactid, productName, caseorigincode, casetypecode, title, description,
      subject, ...otherData
    } = event;
    const product = (productName)
      ? await helpers.fetchProduct(dynamics, productName)
      : null;
    const data = {
      caseorigincode,
      casetypecode,
      title
    };
    if (title) {
      data.title = decodeURIComponent(title.replace( /\+/g, ' ' ));
    }
    if (description) {
      data.description = decodeURIComponent(description.replace( /\+/g, ' ' ));
    }
    if (subject) {
      data.subjectid = {title: decodeURIComponent(subject.replace( /\+/g, ' ' ))};
    }
    if (product) {
      data["productid@odata.bind"] = `/products(${product.productid})`;
    }
    const incidentData = {...data, ...otherData};
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