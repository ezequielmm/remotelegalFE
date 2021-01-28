import { EventModel } from "../../models";
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

export const getTranscriptionsWithPause = (): any => [
    {
        text: "text",
        userEmail: "user@email.com",
        userName: "userName",
        transcriptDateTime,
    },
    {
        from: "2021-01-22T17:00:00-03:00",
        to: "2021-01-22T18:00:00-03:00",
    },
];

export const getTranscriptionsWithPaused = (): any => [
    {
        text: "text",
        userEmail: "user@email.com",
        userName: "userName",
        transcriptDateTime,
    },
    {
        from: "2021-01-22T17:00:00-03:00",
    },
];

export const getEvent = (time, record) => ({
    eventType: record ? EventModel.EventType.onTheRecord : EventModel.EventType.offTheRecord,
    creationDate: `2021-01-22T${time}:00:00-03:00`,
});

export const getEvents = () => [getEvent(17, false), getEvent(18, true)];

export const getRecordResponse = (record) => ({
    creationDate: "2021-01-25T09:41:01-03:00",
    eventType: record ? EventModel.EventType.onTheRecord : EventModel.EventType.offTheRecord,
    id: "e9d2fad6-2513-4fe9-8438-08d8c12e7911",
});
