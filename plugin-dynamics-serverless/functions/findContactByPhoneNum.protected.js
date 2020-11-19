const {corsResponse} = require('jlafer-twilio-runtime-util');

exports.handler = async function handler(context, event, callback) {
  const response = corsResponse();
  try {
    const {phoneNum} = event;
    const tenDigitPhone = phoneNum.replace('+1', '');
    console.log(`findContact: tenDigitPhone = ${tenDigitPhone}`);
    const path = Runtime.getFunctions()['dynamicsWebApi'].path;
    const getApi = require(path);
    const dynamics = getApi(context);

    const properties = ["contactid,firstname,lastname,telephone1,emailaddress1"];
    const filter = `telephone1 eq '${tenDigitPhone}'`;
    dynamics.retrieveMultiple("contacts", properties, filter)
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
    console.log('findContactByPhoneNum: error caught:', err);
    callback(err);
  }
};