import dayjs from "dayjs";

const getNextWorkingDay = (current: dayjs.Dayjs, offset: number) => {
    let partialValue;
    let numDays = offset;

    switch (current.day()) {
        case 0:
            partialValue = current.add(1, "day");
            break;
        case 6:
            partialValue = current.add(2, "day");
            break;
        default:
            partialValue = current;
            break;
    }

    while (numDays > 0) {
        partialValue = partialValue.add(1, "day");

        if (![0, 6].includes(partialValue.day())) numDays -= 1;
    }

    return partialValue;
};

export default getNextWorkingDay;
