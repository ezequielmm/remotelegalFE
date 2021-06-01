import dayjs from "dayjs";
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
            date: dayjs().hour(0).minute(0).add(2, "days").toDate().toString(),
            startTime: dayjs().hour(24).minute(30).second(0).toString(),
            endTime: dayjs().hour(2).minute(30).second(0).toDate().toString(),
            timeZone: TimeZones.ET,
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
