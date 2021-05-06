import React from 'react';
import { Actions, Manager, VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import loadjs from 'loadjs'

import {
  SEARCH_AND_OPEN, PANEL_MINIMIZE, PANEL_DOCK,
  focusTab, getFocusedTab, getTabs
} from './helpers/dynamicsUtil';

//import {InfoPanel} from './components/CustomTaskInfoPanel';
import reducers, { namespace, addTaskTab, removeTaskTab, setMyPageState } from './states';

const PLUGIN_NAME = 'DynamicsCubicPlugin';

const {REACT_APP_DYNAMICS_ORG, REACT_APP_DYNAMICS_CIF_VERSION} = process.env;
console.log(`${PLUGIN_NAME}: REACT_APP_DYNAMICS_ORG = ${REACT_APP_DYNAMICS_ORG}`);
console.log(`${PLUGIN_NAME}: REACT_APP_DYNAMICS_CIF_VERSION = ${REACT_APP_DYNAMICS_CIF_VERSION}`);
const baseURL = `https://${REACT_APP_DYNAMICS_ORG}.crm.dynamics.com`;

function popIncident(incidentId, ticketNumber) {
  console.log(`${PLUGIN_NAME}.popIncident: incidentId=${incidentId} and ticketNumber=${ticketNumber}`);
  window.Microsoft.CIFramework.searchAndOpenRecords(
    'incident',
    `?$select=ticketnumber,title&$search=${ticketNumber}&$top=1&$filter=incidentid eq ${incidentId}`,
    SEARCH_AND_OPEN
  )
  .then(
    function success(result) {
      const res = JSON.parse(result);
      console.log(`${PLUGIN_NAME}: popIncident res:`, res);
      /*
        if the plugin needs access to the returned data, it is available in the
        results array, e.g., res[0].contactid
      */
     return res;
    }
  )
}

async function onNewTask(reservation) {
  const msft = window.Microsoft;
  const task = reservation.task;
  console.log(`${PLUGIN_NAME}: task.attributes:`, task.attributes)
  const {direction, incidentId, ticketNumber} = task.attributes;
  if (msft && direction !== 'outbound') {
    await popIncident(incidentId, ticketNumber);
  }
  await setPanelMode(PANEL_DOCK);
}

const onTaskAccepted = async (payload) => {
  console.log(`${PLUGIN_NAME}.onTaskAccepted: payload:`, payload);
  const manager = Manager.getInstance();
  const msft = window.Microsoft;
  const resSid = payload.sid;
  const tabId = await getFocusedTab(msft);
  console.log(`${PLUGIN_NAME}.onTaskAccepted: tabId: ${tabId}`);
  manager.store.dispatch( addTaskTab(resSid, tabId) );
};

const onTaskSelected = (payload) => {
  console.log(`${PLUGIN_NAME}.onTaskSelected: payload:`, payload);
  const manager = Manager.getInstance();
  const resSid = payload.sid;
  const pageState = manager.store.getState()[namespace].pageState;
  const tabId = pageState.taskTabs[resSid];
  if (tabId) {
    const msft = window.Microsoft;
    focusTab(msft, tabId)
  }
};

const onTaskCompleted = (payload) => {
  const manager = Manager.getInstance();
  const resSid = payload.task.sid;
  manager.store.dispatch( removeTaskTab(resSid) );
  // TODO if no more tasks
    setPanelMode(PANEL_MINIMIZE);
}

// dock (1), minimize (0) or hide (2) the Flex iFrame panel in Dynamics
const setPanelMode = (mode) => window.Microsoft.CIFramework.setMode(mode);

const initCifLibrary = async function() {
  const msft = await window.Microsoft;
  await msft.CIFramework.setClickToAct(true);
  msft.CIFramework.addHandler('onclicktoact', clickToActHandler);
  setPanelMode(PANEL_MINIMIZE);
}

const clickToActHandler = function (eventData) {
  const clickData = JSON.parse(eventData);
  console.log(`${PLUGIN_NAME}: clickData:`, clickData);
  console.log(`${PLUGIN_NAME}: clickData.value:`, clickData.value);
  const actionData = {
    destination: clickData.value.startsWith(1) ? `+${clickData.value}` : `+1${clickData.value.replace('+1', '')}`,
    taskAttributes: {
        name: clickData.recordTitle
    }
  };
  setPanelMode(PANEL_DOCK);
  console.log(`${PLUGIN_NAME}: actionData:`, actionData);
  return Actions.invokeAction('StartOutboundCall', actionData)
    .then(() => Promise.resolve())
    .catch(e => {
      console.log(`${PLUGIN_NAME}: StartOutboundCall error:`, e)
        return Promise.resolve()
    })
}

const dynamicsApiLoadFailure = (notLoaded) => {
  console.error(`${PLUGIN_NAME}: failed to load MS Dynamics CIF library!`, notLoaded);
};

const toggleTab = (_payload) => {
  const manager = Manager.getInstance();
  const pageState = manager.store.getState()[namespace].pageState;
  if (pageState.myPageState === 'INACTIVE') {
    manager.store.dispatch( setMyPageState('PAGE_ACTIVE') );
    focusTab(window.Microsoft, 'tab-id-1');
  }
  else {
    manager.store.dispatch( setMyPageState('INACTIVE') );
    focusTab(window.Microsoft, 'tab-id-0');
  }
  //getFocusedTab(window.Microsoft);
  //getTabs(window.Microsoft);
};

export default class DynamicsCubicPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    this.registerReducers(manager);
    console.log(`${PLUGIN_NAME}: ready to load CIF...`);
    loadjs(`${baseURL}/webresources/Widget/msdyn_ciLibrary.js`, {returnPromise: true})
    .then(initCifLibrary)
    .catch(dynamicsApiLoadFailure);

    flex.AgentDesktopView.defaultProps.showPanel2 = false;
    flex.MainContainer.defaultProps.keepSideNavOpen = true;
    flex.RootContainer.Content.remove('project-switcher');

    flex.Actions.addListener(
      'afterNavigateToView',
      (_payload) => {setPanelMode(PANEL_DOCK);}
    );
    manager.workerClient.on('reservationCreated', onNewTask);
    flex.Actions.addListener('afterAcceptTask', onTaskAccepted);
    flex.Actions.addListener('afterSelectTask', onTaskSelected);
    flex.Actions.addListener('afterCompleteTask', onTaskCompleted);
    //flex.Actions.addListener('afterSetActivity', toggleTab);
    //flex.TaskInfoPanel.Content.replace(<InfoPanel key={'taskInfoPanel'}/>);
  }

  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }
    manager.store.addReducer(namespace, reducers);
  }
}
