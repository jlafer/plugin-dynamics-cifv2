import * as R from 'ramda';

import {
  ADD_TASK_TAB,
  REMOVE_TASK_TAB,
  SET_MY_PAGE_STATE
} from './actions';
  
const initialState = {
  myPageState: 'INACTIVE',
  taskTabs: {}
};

const addTaskTab = (state, action) => {
  const {resSid, tabId} = action.payload;
  return R.assoc(resSid, tabId, state.taskTabs)
}

const removeTaskTab = (state, action) => {
  const resSid = action.payload;
  return R.dissoc(resSid, state.taskTabs)
}

export default function reduce(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK_TAB:
      return {...state, taskTabs: addTaskTab(state, action)};
    case REMOVE_TASK_TAB:
      return {...state, taskTabs: removeTaskTab(state, action)};
    case SET_MY_PAGE_STATE:
      return {...state, myPageState: action.payload};
    default:
      return state;
  }
}
