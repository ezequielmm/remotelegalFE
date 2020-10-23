import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import GlobalState from "./state/GlobalState";
import { combineReducersWithInitialStates } from "./state/utils/combineReducers";
import RoomReducer, { RoomReducerIntialState } from "./state/videoChat/videoChatReducer";

const rootReducer = combineReducersWithInitialStates({
    room: [RoomReducer, RoomReducerIntialState],
});

ReactDOM.render(
    <GlobalState rootReducer={rootReducer}>
        <App />
    </GlobalState>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
