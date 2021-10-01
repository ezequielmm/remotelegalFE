import dayjs from "dayjs";
import getNextWorkingDay from "../../helpers/getNextWorkingDay";

const getDate = (day: number, month: number, year: number) =>
    dayjs()
        .set("date", day)
        .set("month", month - 1)
        .set("year", year);

test.each`
    weekday        | currentDay              | offset | expected
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${2}   | ${getDate(8, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${2}   | ${getDate(9, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${2}   | ${getDate(10, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${2}   | ${getDate(13, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${2}   | ${getDate(14, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${2}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${2}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${3}   | ${getDate(9, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${3}   | ${getDate(10, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${3}   | ${getDate(13, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${3}   | ${getDate(14, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${3}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${3}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${3}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${4}   | ${getDate(10, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${4}   | ${getDate(13, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${4}   | ${getDate(14, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${4}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${4}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${4}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${4}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${5}   | ${getDate(13, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${5}   | ${getDate(14, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${5}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${5}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${5}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${5}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${5}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${6}   | ${getDate(14, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${6}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${6}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${6}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${6}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${6}   | ${getDate(21, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${6}   | ${getDate(21, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${7}   | ${getDate(15, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${7}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${7}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${7}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${7}   | ${getDate(21, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${7}   | ${getDate(22, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${7}   | ${getDate(22, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${8}   | ${getDate(16, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${8}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${8}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${8}   | ${getDate(21, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${8}   | ${getDate(22, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${8}   | ${getDate(23, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${8}   | ${getDate(23, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${9}   | ${getDate(17, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${9}   | ${getDate(20, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${9}   | ${getDate(21, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${9}   | ${getDate(22, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${9}   | ${getDate(23, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${9}   | ${getDate(24, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${9}   | ${getDate(24, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${10}  | ${getDate(20, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${10}  | ${getDate(21, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${10}  | ${getDate(22, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${10}  | ${getDate(23, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${10}  | ${getDate(24, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${10}  | ${getDate(27, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${10}  | ${getDate(27, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${12}  | ${getDate(22, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${12}  | ${getDate(23, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${12}  | ${getDate(24, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${12}  | ${getDate(27, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${12}  | ${getDate(28, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${12}  | ${getDate(29, 9, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${12}  | ${getDate(29, 9, 2021).startOf("day")}
    ${"Monday"}    | ${getDate(6, 9, 2021)}  | ${14}  | ${getDate(24, 9, 2021).startOf("day")}
    ${"Tuesday"}   | ${getDate(7, 9, 2021)}  | ${14}  | ${getDate(27, 9, 2021).startOf("day")}
    ${"Wednesday"} | ${getDate(8, 9, 2021)}  | ${14}  | ${getDate(28, 9, 2021).startOf("day")}
    ${"Thursday"}  | ${getDate(9, 9, 2021)}  | ${14}  | ${getDate(29, 9, 2021).startOf("day")}
    ${"Friday"}    | ${getDate(10, 9, 2021)} | ${14}  | ${getDate(30, 9, 2021).startOf("day")}
    ${"Saturday"}  | ${getDate(11, 9, 2021)} | ${14}  | ${getDate(1, 10, 2021).startOf("day")}
    ${"Sunday"}    | ${getDate(12, 9, 2021)} | ${14}  | ${getDate(1, 10, 2021).startOf("day")}
`(
    "it should return correct next working day if today is $weekday and the offset is $offset",
    ({ currentDay, offset, expected }) => {
        const nextWorkingDay = getNextWorkingDay(currentDay, offset);
        expect(nextWorkingDay.startOf("day")).toStrictEqual(expected.startOf("day"));
    }
);
