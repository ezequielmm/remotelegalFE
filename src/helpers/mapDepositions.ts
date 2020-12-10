import moment from "moment-timezone";
import { DepositionModel, ParticipantModel } from "../models";
import formatToDateOffset from "./formatToDateOffset";

const mapDepositions = ({
    requesterPhone,
    requesterName,
    requesterEmail,
    details,
    depositions,
    otherParticipants,
}: {
    requesterPhone?: string;
    requesterName: string;
    requesterEmail: string;
    details?: string;
    otherParticipants?: ParticipantModel.IParticipant[];
    depositions: DepositionModel.ICreateDeposition[];
}) => {
    const files = [];
    const mappedDepositions = depositions.map(
        ({ witness, isVideoRecordingNeeded, date, startTime, endTime, file, timeZone, ...deposition }) => {
            if (file) files.push(file);
            const formattedStart = moment(startTime).format("HH:mm:ss");
            const formattedEnd = endTime && moment(endTime).format("HH:mm:ss");
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
                startDate: formatToDateOffset(String(date), formattedStart, timeZone),
                endDate: formattedEnd === "" ? null : formatToDateOffset(String(date), formattedEnd, timeZone),
                caption: file?.uid,
                witness: mapWitness,
                participants: otherParticipants,
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
