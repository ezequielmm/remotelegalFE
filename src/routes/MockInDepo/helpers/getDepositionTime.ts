import moment from "moment";

const getDepositionTime = (time) => {
    const depoTime = moment(time).format("hh:mm A");
    const dayNumber = moment(time).date();
    const dayName = moment(time).format("ddd");
    const month = moment(time).format("MMMM");
    const year = moment(time).year();

    return `The deposition is scheduled for ${dayName}, ${month} ${dayNumber}, ${year}, ${depoTime}`;
};
export default getDepositionTime;
