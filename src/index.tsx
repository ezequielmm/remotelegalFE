import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import WindowSizeContext from "./contexts/WindowSizeContext";
import * as serviceWorker from "./serviceWorker";
import { getDeps } from "./state/dependencies";
import GlobalState, { rootReducer } from "./state/GlobalState";

ReactDOM.render(
    <GlobalState rootReducer={rootReducer} deps={getDeps()}>
        <WindowSizeContext>
            <App />
        </WindowSizeContext>
    </GlobalState>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
