import React, { useEffect } from "react";
import { useParams } from "react-router";
import { datadogLogs } from "@datadog/browser-logs";

const withDDContext = (component) => {
    function WithDDContext(props) {
        const { depositionID } = useParams<{ depositionID: string }>();
        useEffect(() => {
            if (depositionID) {
                datadogLogs.addLoggerGlobalContext("depositionID", depositionID);
            }
        }, [depositionID]);
        return component(props) as JSX.Element;
    }

    return WithDDContext;
};

export default withDDContext;
