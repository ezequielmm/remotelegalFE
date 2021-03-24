import moment from "moment";

const isCanceledDateInvalid = (
    date: string | number | moment.Moment | Date | (string | number)[] | moment.MomentInputObject
) => {
    const currentDate = moment(new Date());
    const depoDate = moment(date);
    const minutes = depoDate.diff(currentDate, "minutes");
    return minutes < 1;
};
export default isCanceledDateInvalid;
