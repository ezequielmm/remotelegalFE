import moment from "moment";

export default (date: string, time: string) =>
    moment(date.replace(/..:..:../, time)).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ");