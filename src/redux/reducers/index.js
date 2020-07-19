import {EMAIL_CHANGE, AUTHENTICATION_CHANGE, JURUSAN_ID} from '../action/type';
import {combineReducers} from 'redux';

const initialState = {
  email: '',
  authentication: '',
  jurusan_id: '',
};

const reducers = (state = {initialState}, action) => {
  switch (action.type) {
    case EMAIL_CHANGE:
      return {...state, email: action.payload};
    case AUTHENTICATION_CHANGE:
      return {...state, authentication: action.payload};
    case JURUSAN_ID:
      return {...state, jurusan_id: action.payload};
    default:
      return state;
  }
};

const appState = combineReducers ({
  reducers,
});

export default appState;
