import moment, { Moment } from "moment-timezone";
import { DateLike, mapTimeZone } from "../../../models/general";

export default (date: string | Moment | DateLike, previousTimeZone: string, newTimeZone: string) => {
    const newDate = moment(date).tz(mapTimeZone[previousTimeZone]).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
    const timeZone = moment(newDate).tz(mapTimeZone[newTimeZone]).format("Z");
    return `${newDate}${timeZone}`;
};

export const changeDate = (newDate: Moment, timeZone: string, oldDate: Moment): Moment => {
    const m = moment().tz(mapTimeZone[timeZone]);
    m.set("year", newDate.get("year"));
    m.set("month", newDate.get("month"));
    m.set("day", newDate.get("day"));
    m.set("hour", oldDate.get("hour"));
    m.set("minute", oldDate.get("minute"));
    m.set("seconds", oldDate.get("seconds"));
    m.set("milliseconds", 0);
    return m;
};
