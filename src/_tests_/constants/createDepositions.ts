import moment from "moment-timezone";
import * as CONSTANTS from "../../constants/createDeposition";
import mapDepositions from "../../helpers/mapDepositions";
import { TimeZones } from "../../models/general";
import { getCaseAsc } from "./cases";

// eslint-disable-next-line import/prefer-default-export

export const getDepositions = () => ({
    caseId: getCaseAsc()[0].id,
    depositions: [
        {
            witness: {
                name: "",
                email: "",
                phone: null,
            },
            file: null,
            date: moment("00:00 AM", CONSTANTS.TIME_FORMAT).add(2, "days").toString(),
            startTime: moment("12:30 AM", CONSTANTS.TIME_FORMAT).toString(),
            endTime: moment("02:30 AM", CONSTANTS.TIME_FORMAT).toString(),
            timeZone: TimeZones.EST,
            isVideoRecordingNeeded: null,
        },
    ],
    details: "",
    requesterPhone: null,
    requesterEmail: "a@a.a",
    requesterName: "name",
});

export const getMappedDepositions1 = () => {
    const { details, requesterPhone, requesterName, requesterEmail, depositions } = getDepositions();
    return mapDepositions({
        depositions,
        requesterPhone,
        requesterName,
        requesterEmail,
        details,
    }).mappedDepositions;
};
