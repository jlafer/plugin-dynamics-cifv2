import * as R from 'ramda';
import { Actions, Manager, VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import loadjs from 'loadjs'

import {
  PANEL_MINIMIZE, PANEL_DOCK,
  focusTab, getFocusedTab, popIncident
} from './helpers/dynamicsUtil';

//import {InfoPanel} from './components/CustomTaskInfoPanel';
import reducers, { namespace, addTaskTab, removeTaskTab, setMyPageState } from './states';

const PLUGIN_NAME = 'DynamicsCubicPlugin';

const {REACT_APP_DYNAMICS_ORG, REACT_APP_DYNAMICS_CIF_VERSION} = process.env;
console.log(`${PLUGIN_NAME}: REACT_APP_DYNAMICS_ORG = ${REACT_APP_DYNAMICS_ORG}`);
console.log(`${PLUGIN_NAME}: REACT_APP_DYNAMICS_CIF_VERSION = ${REACT_APP_DYNAMICS_CIF_VERSION}`);

const baseURL = `https://${REACT_APP_DYNAMICS_ORG}.crm.dynamics.com`;

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

const onTaskSelected = async (payload) => {
  console.log(`${PLUGIN_NAME}.onTaskSelected: payload:`, payload);
  const manager = Manager.getInstance();
  const resSid = payload.sid;
  const pageState = manager.store.getState()[namespace].pageState;
  const msft = window.Microsoft;
  const currentTabId = await getFocusedTab(msft);
  const tabId = pageState.taskTabs[resSid];
  if (tabId && tabId !== currentTabId) {
    focusTab(msft, tabId)
  }
};

const objPropsCnt = R.pipe(R.keys, R.length);

const currentTaskCnt = (pageState) => objPropsCnt(pageState.taskTabs);

const onTaskCompleted = (payload) => {
  const manager = Manager.getInstance();
  const resSid = payload.task.sid;
  manager.store.dispatch( removeTaskTab(resSid) );
  const pageState = manager.store.getState()[namespace].pageState;
  if ( currentTaskCnt(pageState) === 0)
    setPanelMode(PANEL_MINIMIZE);
}

const onNavigateToView = (_payload) => {
  setPanelMode(PANEL_DOCK);
};

// dock (1), minimize (0) or hide (2) the Flex iFrame panel in Dynamics
const setPanelMode = (mode) => window.Microsoft.CIFramework.setMode(mode);

const initCifLibrary = function() {
  window.addEventListener('CIFInitDone', addCifHandlers);
}

const addCifHandlers = async function() {
  console.log(`${PLUGIN_NAME}: addCifHandlers called`);
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
    .then(Promise.resolve)
    .catch(e => {
      console.log(`${PLUGIN_NAME}: StartOutboundCall error:`, e);
      return Promise.resolve();
    })
}

const dynamicsApiLoadFailure = (notLoaded) => {
  console.error(`${PLUGIN_NAME}: failed to load MS Dynamics CIF library!`, notLoaded);
};

export default class DynamicsCubicPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing...`);
    this.registerReducers(manager);
    loadjs(`${baseURL}/webresources/Widget/msdyn_ciLibrary.js`, {returnPromise: true})
      .then(initCifLibrary)
      .catch(dynamicsApiLoadFailure);

    flex.AgentDesktopView.defaultProps.showPanel2 = false;
    flex.MainContainer.defaultProps.keepSideNavOpen = true;
    flex.RootContainer.Content.remove('project-switcher');

    manager.workerClient.on('reservationCreated', onNewTask);
    flex.Actions.addListener('afterAcceptTask', onTaskAccepted);
    flex.Actions.addListener('afterSelectTask', onTaskSelected);
    flex.Actions.addListener('afterCompleteTask', onTaskCompleted);
    flex.Actions.addListener('afterNavigateToView', onNavigateToView);
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
