import { Actions, Manager, VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import {
  PANEL_MINIMIZE, PANEL_DOCK,
  focusTab, getFocusedTab, initDynamicsCIF, popIncident, setPanelMode
} from './helpers/dynamicsUtil';
import {objPropsCnt} from './helpers/util';
//import {InfoPanel} from './components/CustomTaskInfoPanel';
import reducers, { namespace, addTaskTab, removeTaskTab } from './states';

const PLUGIN_NAME = 'DynamicsCIFv2Plugin';

const {REACT_APP_DYNAMICS_ORG} = process.env;
console.log(`${PLUGIN_NAME}: REACT_APP_DYNAMICS_ORG = ${REACT_APP_DYNAMICS_ORG}`);

const baseURL = `https://${REACT_APP_DYNAMICS_ORG}.crm.dynamics.com`;

async function onNewTask(reservation) {
  const task = reservation.task;
  console.log(`${PLUGIN_NAME}: task.attributes:`, task.attributes)
  const {incidentId, ticketNumber} = task.attributes;
  // TODO need to exclude O/B contacts
  await popIncident(incidentId, ticketNumber);
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

const onTaskCompleted = (payload) => {
  const manager = Manager.getInstance();
  const resSid = payload.task.sid;
  manager.store.dispatch( removeTaskTab(resSid) );
  const pageState = manager.store.getState()[namespace].pageState;

  // if the last active task has completed, minimize the Flex panel
  if ( objPropsCnt(pageState.taskTabs) === 0)
    setPanelMode(PANEL_MINIMIZE);
}

const onNavigateToView = (_payload) => { setPanelMode(PANEL_DOCK); };

const clickToActHandler = function (eventData) {
  const clickData = JSON.parse(eventData);
  console.log(`${PLUGIN_NAME}: clickData:`, clickData);
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

export default class DynamicsCIFv2Plugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    console.log(`${PLUGIN_NAME}: initializing...`);
    this.registerReducers(manager);
    initDynamicsCIF(baseURL, clickToActHandler);
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
