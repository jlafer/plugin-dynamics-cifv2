// constants used by searchAndOpenRecords
export const SEARCH_ONLY = true;
export const SEARCH_AND_OPEN = false;

// constants used by setMode
export const PANEL_MINIMIZE = 0;
export const PANEL_DOCK = 1;
export const PANEL_HIDE = 2;  // CIF v2 only

export const popIncident = (incidentId, ticketNumber) => {
  console.log(`popIncident: incidentId=${incidentId} and ticketNumber=${ticketNumber}`);
  window.Microsoft.CIFramework.searchAndOpenRecords(
    'incident',
    `?$select=ticketnumber,title&$search=${ticketNumber}&$top=1&$filter=incidentid eq ${incidentId}`,
    SEARCH_AND_OPEN
  )
  .then(
    function success(result) {
      const res = JSON.parse(result);
      console.log(`popIncident: res:`, res);
      /*
        if you need access to the returned data, it is available in the
        results array, e.g., res[0].contactid
      */
      return res;
    }
  )
}

export const getTabs = (msft) => {
  msft.CIFramework.getTabs().then(
    function success(result) {
      console.log('getTabs:', result);
      // perform operations on tab id value
    },
    function (error) {
      console.log('getTabs:', error.message);
      // handle error conditions
    }
  );
}

export const getFocusedTab = (msft) => msft.CIFramework.getFocusedTab();

export const focusTab = (msft, tabId) => {
  msft.CIFramework.focusTab(tabId).then(
    function success(result) {
      console.log('focusTab:', result);
    },
    function (error) {
      console.log('focusTab:', error.message);
    }
  );
}