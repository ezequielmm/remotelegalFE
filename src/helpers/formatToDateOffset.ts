import moment from "moment-timezone";
import { TimeZones } from "../models/deposition";

const mapTimeZone = {
    [TimeZones.CST]: "America/Chicago",
    [TimeZones.EST]: "America/New_York",
    [TimeZones.PST]: "America/Los_Angeles",
    [TimeZones.MST]: "America/Denver",
};

export default (date: string, time: string, timeZone: TimeZones) =>
    moment(date.replace(/..:..:../, time))
        .tz(mapTimeZone[timeZone], true)
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");
