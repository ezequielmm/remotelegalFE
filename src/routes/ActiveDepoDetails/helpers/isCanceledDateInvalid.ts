import dayjs, { Dayjs } from "dayjs";

const isCanceledDateInvalid = (date: string | number | Dayjs | Date) => {
    const currentDate = dayjs(new Date());
    const depoDate = dayjs(date);
    const minutes = depoDate.diff(currentDate, "minutes");
    return minutes < 1;
};
export default isCanceledDateInvalid;
