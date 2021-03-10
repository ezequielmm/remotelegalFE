import { EventModel, TranscriptionModel } from "../../models";
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

export const getTranscriptionsWithOffset = (): TranscriptionModel.Transcription[] => [
    {
        text: "Hello, how are you?",
        transcriptDateTime: "2021-03-09T12:51:56",
        transcriptionVideoTime: 110,
        duration: 280,
        confidence: 0,
        userName: "Facu Cast",
        id: "fad7d738-6d8b-4b10-a77f-08d8e2fa1f50",
    },
    {
        text: "This is not for official use.",
        transcriptDateTime: "2021-03-09T12:52:02",
        transcriptionVideoTime: 115,
        duration: 50,
        confidence: 0,
        userName: "Facu Cast",
        id: "07380222-ba75-478c-a780-08d8e2fa1f50",
    },
    {
        text: "Let's see if the highlighting is is doing OK.",
        transcriptDateTime: "2021-03-09T12:52:09",
        transcriptionVideoTime: 123,
        duration: 460,
        confidence: 0,
        userName: "Facu Cast",
        id: "8c88dd44-4245-4d84-a781-08d8e2fa1f50",
    },
    {
        text: "Well my English is improving.",
        transcriptDateTime: "2021-03-09T12:52:17",
        transcriptionVideoTime: 130,
        duration: 840,
        confidence: 0,
        userName: "Facu Cast",
        id: "edc08e1f-2cd8-4e56-a782-08d8e2fa1f50",
    },
];

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
