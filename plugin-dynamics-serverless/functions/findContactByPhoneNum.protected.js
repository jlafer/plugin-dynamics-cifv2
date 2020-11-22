/*
  findContactByPhoneNum.js
  Finds a contact object with the BusinessPhone (telephone1) specified.
  Input parameters:
    phoneNum (an E.164 or 10-digit phone number)
*/
const {corsResponse} = require('jlafer-twilio-runtime-util');
let helpersPath = Runtime.getFunctions()['dynamicsHelpers'].path;
let helpers = require(helpersPath);

exports.handler = async function handler(context, event, callback) {
  const response = corsResponse();
  try {
    const dynamics = helpers.getApi(context);
    const {phoneNum} = event;
    const contact = await helpers.fetchContact(dynamics, phoneNum);
    response.appendHeader('Content-Type', 'application/json');
    response.setBody(contact);
    callback(null, response);
  } catch (err) {
    console.log('findContactByPhoneNum: threw error:', err.stack);
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody(err.message);
    callback(null, response);
  }
};