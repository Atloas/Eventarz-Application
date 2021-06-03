import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from "react-redux";
import thunkMiddleware from 'redux-thunk';
import { reducer } from "./redux/reducer";
import App from "./components/App";
import "./app.css";
import { initialState } from "./redux/reducer"

const destination = document.querySelector("#root");

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(reducer, initialState, composedEnhancer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  destination
);