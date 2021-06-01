import React, { useEffect } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { mapTimeZone, TimeZones } from "../models/general";

dayjs.extend(utc);
dayjs.extend(timezone);

const getTime = (depoTimeZone: TimeZones) =>
    (depoTimeZone ? dayjs().tz(mapTimeZone[depoTimeZone]) : dayjs())?.format("MMM DD YYYY - hh:mm:ss A").toString();

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
