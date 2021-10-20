import React from "react";
import { Route, RouteProps } from "react-router-dom";
import { isFirefox } from "react-device-detect";

import BlockFirefoxScreen from "../../routes/InDepo/BlockFirefoxScreen";

const ProtectedRoute = ({ component, ...rest }: RouteProps) => (
    <Route {...rest} render={(props) => React.createElement(isFirefox ? BlockFirefoxScreen : component, props)} />
);

export default ProtectedRoute;
