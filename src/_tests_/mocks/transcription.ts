import { TimeZones } from "../../models/general";

const transcriptDateTime = "2021-01-05T17:52:08.2345064Z";
export const transcriptionTimeESTFormatted = "12:52:08 PM";
export const timeZone = TimeZones.EST;

export const getTranscription = (): any => ({
    text: "text",
    userEmail: "user@email.com",
    userName: "userName",
    transcriptDateTime,
});
