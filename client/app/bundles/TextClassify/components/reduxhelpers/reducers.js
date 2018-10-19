import { combineReducers } from 'redux';
import { actions } from './actions.js';

function classifyStatus(state = null, action) {
  if (state === null) {
    try {
      state = window.localStorage.getItem("classifyStatus");
      if (state !== null) {
        state = JSON.parse(state);
      }
    } catch (e) {
      state = null;
    }
  }
  if (state === null) {
      state = {};
  }

  // Redux expects a new object to be returned.
  let newstate = Object.assign({}, state);
  switch (action.type) {
    case actions.MODEL_UPDATE:
      newstate.model = action.model;
      window.localStorage.setItem("classifyStatus", JSON.stringify(newstate));
      return newstate;
    case actions.TEXT_UPDATE:
      newstate.text = action.text;
      window.localStorage.setItem("classifyStatus", JSON.stringify(newstate));
      return newstate;
    case actions.DEFAULTS_UPDATE:
      // Only set defaults if state is empty.
      if (!newstate.model) {
        newstate.model = action.model;
      }
      if (!newstate.text) {
        newstate.text = action.text;
      }
      window.localStorage.setItem("classifyStatus", JSON.stringify(newstate));
      return newstate;
  }
  return state;
}

const classifyApp = combineReducers({
  classifyStatus,
});

export default classifyApp;
