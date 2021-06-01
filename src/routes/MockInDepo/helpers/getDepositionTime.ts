import dayjs from "dayjs";

const getDepositionTime = (time) => {
    const depoTime = dayjs(time).format("hh:mm A");
    const dayNumber = dayjs(time).date();
    const dayName = dayjs(time).format("ddd");
    const month = dayjs(time).format("MMMM");
    const year = dayjs(time).year();

    return `The deposition is scheduled for ${dayName}, ${month} ${dayNumber}, ${year}, ${depoTime}`;
};
export default getDepositionTime;
