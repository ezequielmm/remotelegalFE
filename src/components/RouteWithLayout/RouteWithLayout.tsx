import React from "react";
import { Route, RouteProps } from "react-router-dom";
import Layout from "../Layout";

interface RouteWithLayoutProps extends RouteProps {
    layout?: React.FC;
}

function RouteWithLayout({ layout = Layout, component, ...rest }: RouteWithLayoutProps) {
    return (
        <Route {...rest} render={(props) => React.createElement(layout, null, React.createElement(component, props))} />
    );
}
export default RouteWithLayout;
