import moment from "moment-timezone";
import { DepositionModel } from "../models";
import formatToDateOffset from "./formatToDateOffset";

const mapDepositions = ({
    requesterPhone,
    requesterName,
    requesterEmail,
    details,
    depositions,
}: {
    requesterPhone?: string;
    requesterName: string;
    requesterEmail: string;
    details?: string;
    depositions: DepositionModel.ICreateDeposition[];
}) => {
    const files = [];
    const mappedDepositions = depositions.map(
        ({ witness, isVideoRecordingNeeded, date, startTime, endTime, file, ...deposition }) => {
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
                startDate: formatToDateOffset(String(date), formattedStart),
                endDate: formattedEnd === "" ? null : formatToDateOffset(String(date), formattedEnd),
                caption: file?.uid,
                witness: mapWitness,
                isVideoRecordingNeeded: isVideoRecordingNeeded === "YES",
                requesterPhone,
                requesterName,
                requesterEmail,
                details,
            };
        }
    );
    return { mappedDepositions, files };
};

export default mapDepositions;
