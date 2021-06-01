import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { DepositionModel, ParticipantModel } from "../models";
import formatToDateOffset from "./formatToDateOffset";

dayjs.extend(timezone);

const mapDepositions = ({
    requesterPhone,
    requesterName,
    requesterEmail,
    details,
    depositions,
    normalizedParticipants,
}: {
    requesterPhone?: string;
    requesterName: string;
    requesterEmail: string;
    details?: string;
    normalizedParticipants?: ParticipantModel.IParticipant[];
    depositions: DepositionModel.ICreateDeposition[];
}) => {
    const files = [];
    const mappedDepositions = depositions.map(
        ({ witness, isVideoRecordingNeeded, date, startTime, endTime, file, timeZone, ...deposition }) => {
            if (file) files.push(file);

            const mapWitness =
                witness.email || witness.name || witness.phone
                    ? {
                          email: witness.email || null,
                          name: witness.name || null,
                          phone: witness.phone || null,
                          role: "witness",
                      }
                    : undefined;

            return {
                ...deposition,
                startDate: formatToDateOffset(date as Dayjs, startTime as Dayjs, timeZone),
                endDate: endTime ? formatToDateOffset(date as Dayjs, endTime as Dayjs, timeZone) : null,
                caption: file?.uid,
                witness: mapWitness,
                participants: normalizedParticipants,
                isVideoRecordingNeeded: isVideoRecordingNeeded === "YES",
                requesterPhone,
                requesterName,
                requesterEmail,
                timeZone,
                details,
            };
        }
    );
    return { mappedDepositions, files };
};

export default mapDepositions;
