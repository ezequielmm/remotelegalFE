import moment from "moment-timezone";
import { mapTimeZone, TimeZones } from "../models/general";

export default (date: string, time: string, timeZone: TimeZones) =>
    moment(date.replace(/..:..:../, time))
        .tz(mapTimeZone[timeZone], true)
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
