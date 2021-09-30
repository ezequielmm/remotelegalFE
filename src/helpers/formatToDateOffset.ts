import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { mapTimeZone, TimeZones } from "../models/general";

dayjs.extend(utc);
dayjs.extend(timezone);

export default (date: Dayjs, time: Dayjs, timeZone: TimeZones) => {
    if (!date || !time || !timeZone) {
        return null;
    }
    return dayjs(date)
        .hour(dayjs(time).hour())
        .minute(dayjs(time).minute())
        .second(dayjs(time).second())
        .tz(mapTimeZone[timeZone], true)
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
};

export const formatToDateWithoutTZ = (date: Dayjs, time: Dayjs, timeZone: TimeZones) => {
    if (!date || !time || !timeZone) {
        return null;
    }
    return dayjs(date)
        .hour(dayjs(time).hour())
        .minute(dayjs(time).minute())
        .second(dayjs(time).second())
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
};
