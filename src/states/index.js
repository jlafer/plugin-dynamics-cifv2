import { combineReducers } from 'redux';

import {
  SET_CURRENT_TASK, SET_SERVERLESS_URI, SET_SYNC_TOKEN,
  ADD_TASK_TAB, REMOVE_TASK_TAB, SET_MY_PAGE_STATE
} from './actions';
import appStateReducer from "./AppState";
import pageStateReducer from "./PageState";

// TODO give your plugin's redux store a unique namespace
export const namespace = 'plugin-dynamics';

export default combineReducers({
  pageState: pageStateReducer,
  appState: appStateReducer
});

export const setServerlessUri = (payload) => ({
  type: SET_SERVERLESS_URI, payload
});

export const setSyncToken = (payload) => ({
  type: SET_SYNC_TOKEN, payload
});

export const setCurrentTask = (payload) => ({
  type: SET_CURRENT_TASK, payload
});

// a sample Redux action creator
export const setMyPageState = (payload) => ({
  type: SET_MY_PAGE_STATE, payload
});

export const addTaskTab = (resSid, tabId) => ({
  type: ADD_TASK_TAB, payload: {resSid, tabId}
});

export const removeTaskTab = (payload) => ({
  type: REMOVE_TASK_TAB, payload
});