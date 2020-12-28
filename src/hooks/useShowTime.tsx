import React, { useEffect } from "react";
import moment from "moment-timezone";
import { mapTimeZone, TimeZones } from "../models/general";

const getTime = (timeZone?: TimeZones) =>
    (timeZone ? moment().tz(mapTimeZone[timeZone]) : moment()).format("MMM DD YYYY - HH:mm:ss A").toString();
const useShowTime = ({ timeZone, updateInterval }: { timeZone?: TimeZones; updateInterval: number }) => {
    const [time, setTime] = React.useState<string>();

    useEffect(() => {
        if (!timeZone) return undefined;
        const intervalId = setInterval(() => {
            setTime(getTime(timeZone));
        }, updateInterval);
        return () => {
            clearInterval(intervalId);
            setTime(null);
        };
    }, [timeZone, updateInterval]);

    return time;
};

export default useShowTime;
