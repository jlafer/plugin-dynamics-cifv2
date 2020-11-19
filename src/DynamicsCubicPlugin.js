import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import loadjs from "loadjs"

import {InfoPanel} from "./components/CustomTaskInfoPanel";
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'DynamicsCubicPlugin';

const baseURL = 'https://twillio.crm.dynamics.com'

export default class DynamicsCubicPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  init(flex, manager) {
    this.registerReducers(manager);
    loadjs(`${baseURL}/webresources/Widget/msdyn_ciLibrary.js`, 'CIF');
    flex.TaskInfoPanel.Content.replace(<InfoPanel key={'taskInfoPanel'}/>);
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
