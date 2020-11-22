/*
  createCase.js
  Creates an incident object (displayed as a Case) for the contact specified.
  Input parameters:
    contact_id
*/
exports.handler = function(context, event, callback) {
  try {
    const {contact_id: contactid} = event;
    console.log(`createCase: contactid = ${contactid}`);
    const path = Runtime.getFunctions()['dynamicsWebApi'].path;
    const getApi = require(path);
    const dynamics = getApi(context);
    const incident = {
      "caseorigincode": 1,            // 1 = Phone
      "casetypecode": 3,              // 3 = Request
      "title": "Assistance with Card Renewal",
      "customerid_contact@odata.bind": "/contacts(" + contactid + ")",
      "description": "Customer requested assistance with transit card renewal",
      "subjectid": {
        title: "Payment Card *2355, Expires: 12/2020"
      },
      "productid@odata.bind": `/products(4ebac939-432c-eb11-a813-0022481d2d5a)`
    };
    dynamics.create(incident, "incidents")
    .then(function (id) {
      const request = {
        collection: "incidents",
        select: ["ticketnumber"],
        filter: "incidentid eq "+id,
        maxPageSize: 1,
        count: true
      };
      dynamics.retrieveMultipleRequest(request)
      .then(function (response) {
        const records = response.value;
        const cnt = Object.keys(records).length;
        if (cnt >=1) {
          callback(
            null,
            {
              'incidentId': id,
              'ticketNumber': records[0].ticketnumber
            }
          );
        }
        else{
          console.log('createCase: newly created incident not found???');
          callback(null, null);
        }
      })
      .catch(function (error) {
        console.log('createCase: error getting incident: ', error);
        callback(null, null);
      });
    })
    .catch(function (error) {
      console.log('createCase: error:', error);
      callback(error);
    });
  } catch (err) {
    console.log('createCase: error caught:', err);
    callback(err);
  }
};