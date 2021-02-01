/* eslint-disable no-plusplus */
import moment from "moment-timezone";
import { EventModel, TranscriptionModel } from "../models";

export const setTranscriptionMessages = (
    transcriptions: TranscriptionModel.Transcription[],
    events: EventModel.IEvent[]
): (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[] => {
    const pauses = events.reduce((acc, event: EventModel.IEvent) => {
        const isOnTheRecordObject = event.eventType === EventModel.EventType.onTheRecord ? "to" : "from";
        if (acc.length === 0 || isOnTheRecordObject === "from") {
            return [...acc, { [isOnTheRecordObject]: event.creationDate }];
        }
        const lastAcc = acc[acc.length - 1];
        return [...acc.slice(0, acc.length - 1), { ...lastAcc, [isOnTheRecordObject]: event.creationDate }];
    }, []);

    const transcriptionsWithPauses = [...transcriptions] as (TranscriptionModel.Transcription &
        TranscriptionModel.TranscriptionPause)[];
    let index = 0;
    while (pauses.length > 0 && index < transcriptionsWithPauses.length) {
        if (moment(pauses[0].to).isBefore(moment(transcriptionsWithPauses[index].transcriptDateTime), "second")) {
            transcriptionsWithPauses.splice(index, 0, pauses.shift());
        }
        index++;
    }
    transcriptionsWithPauses.push(...pauses);
    return transcriptionsWithPauses;
};

export const addTranscriptionMessages = (newTranscription, transcriptions) => {
    if (newTranscription.eventType === EventModel.EventType.offTheRecord) {
        return [...transcriptions, { from: newTranscription.creationDate }];
    }
    if (newTranscription.eventType === EventModel.EventType.onTheRecord) {
        return transcriptions.length > 0
            ? [
                  ...transcriptions.slice(0, transcriptions.length - 1),
                  { ...transcriptions[transcriptions.length - 1], to: newTranscription.creationDate },
              ]
            : [{ to: newTranscription.creationDate }];
    }
    if (newTranscription.text === "") return transcriptions;
    const laterTranscriptionIndex = transcriptions.findIndex((transcription) => {
        return (
            (transcription.from && !transcription.to) ||
            moment(newTranscription.transcriptDateTime).isBefore(moment(transcription.transcriptDateTime), "second")
        );
    });
    const newTranscriptions =
        laterTranscriptionIndex === -1
            ? [...transcriptions, newTranscription]
            : [
                  ...transcriptions.slice(0, laterTranscriptionIndex),
                  newTranscription,
                  ...transcriptions.slice(laterTranscriptionIndex),
              ];

    return newTranscriptions;
};