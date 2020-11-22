import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import loadjs from "loadjs"

import {InfoPanel} from "./components/CustomTaskInfoPanel";
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'DynamicsCubicPlugin';

const {REACT_APP_DYNAMICS_ORG} = process.env;
console.log(`REACT_APP_DYNAMICS_ORG = ${REACT_APP_DYNAMICS_ORG}`);
const baseURL = `https://${REACT_APP_DYNAMICS_ORG}.crm.dynamics.com`

function screenpop(incidentId, ticketNumber) {
  window.Microsoft.CIFramework.searchAndOpenRecords(
    "incident",
    `?$select=ticketnumber,title&$search=${ticketNumber}&$top=1&$filter=incidentid eq ${incidentId}`,
    false
  )
  .then(
    function success(result) {
      const res = JSON.parse(result);
      console.log(`screenpop: `, res);
      //updateTaskAttributes(task.sid, res[0].contactid)
    },
    function (error) {
      console.log(error.message);
    }
  )
}

/** Navigate to Contact Page on reservation
 ** adjust number to handle WhatsApp **/
function showContact(reservation) {
  const task = reservation.task;
  console.info('!!!task.attributes', task.attributes)
  const {from, direction, incidentId, ticketNumber} = task.attributes;
  if (window.Microsoft && direction !== 'outbound') {
    //const fromNumber = from.replace('+1', '').replace('whatsapp:', '')
    screenpop(incidentId, ticketNumber);
  }
  panel(1);
}

// open (1) or close (0) the Flex iFrame panel in Dynamics
function panel(mode) {
  window.Microsoft.CIFramework.setMode(mode);
}

const onClickToActHandler = () => {
  console.log('onClickToActHandler: called');
};

const initDynamicsApi = () => {
  console.log('loadjs.ready: window.Microsoft.CIFramework:', window.Microsoft.CIFramework);
  window.Microsoft.CIFramework.addHandler(
    "onclicktoact",
    onClickToActHandler
  );
};

export default class DynamicsCubicPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    this.registerReducers(manager);
    loadjs(`${baseURL}/webresources/Widget/msdyn_ciLibrary.js`, 'CIF');
    loadjs.ready('CIF', initDynamicsApi);
    flex.AgentDesktopView.defaultProps.showPanel2 = false;
    flex.MainContainer.defaultProps.keepSideNavOpen = true;
    flex.Actions.addListener(
      "afterNavigateToView",
      (_payload) => {panel(1);}
    );
    flex.Actions.addListener(
      "afterCompleteTask",
      (_payload) => {panel(0);}
    );
    flex.RootContainer.Content.remove("project-switcher");
    flex.TaskInfoPanel.Content.replace(<InfoPanel key={'taskInfoPanel'}/>);
    manager.workerClient.on("reservationCreated", showContact);
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
