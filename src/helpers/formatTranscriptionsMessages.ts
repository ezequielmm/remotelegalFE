/* eslint-disable no-plusplus */
import dayjs from "dayjs";

import { EventModel, TranscriptionModel } from "../models";

export const setTranscriptionMessages = (
    transcriptions: TranscriptionModel.Transcription[],
    events: EventModel.IEvent[],
    removeCurrentPause?: boolean
): (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[] => {
    if (!transcriptions) return null;

    let pauses = events.reduce((acc, event: EventModel.IEvent) => {
        const isOnTheRecordObject = event.eventType === EventModel.EventType.onTheRecord ? "to" : "from";
        if (acc.length === 0 || isOnTheRecordObject === "from") {
            return [...acc, { [isOnTheRecordObject]: event.creationDate, id: event.id }];
        }
        const lastAcc = acc[acc.length - 1];
        return [
            ...acc.slice(0, acc.length - 1),
            { ...lastAcc, [isOnTheRecordObject]: event.creationDate, id: event.id },
        ];
    }, []);
    const filterPauses = removeCurrentPause ? (pause) => pause.to : (pause) => pause.from;
    pauses = pauses.filter(filterPauses);

    let transcriptionsWithPauses = [
        ...transcriptions.filter((transcription) => transcription.text !== ""),
    ] as (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    if (removeCurrentPause)
        transcriptionsWithPauses = transcriptionsWithPauses.map((trancription, i) => ({
            ...trancription,
            prevEndTime: transcriptions[i - 1]?.transcriptionVideoTime || 0,
        }));
    let index = 0;
    while (pauses.length > 0 && index < transcriptionsWithPauses.length) {
        if (dayjs(pauses[0].to).isBefore(dayjs(transcriptionsWithPauses[index].transcriptDateTime), "second")) {
            transcriptionsWithPauses.splice(index, 0, pauses.shift());
        }
        index++;
    }
    transcriptionsWithPauses.push(...pauses);
    return transcriptionsWithPauses;
};

export const addTranscriptionMessages = (newTranscription, transcriptions = [], isRecording: boolean) => {
    if (!transcriptions) {
        return [];
    }
    const transcriptionsCopy = [...transcriptions];

    if (newTranscription.eventType === EventModel.EventType.offTheRecord && !isRecording) {
        return [...transcriptionsCopy, { from: newTranscription.creationDate, id: newTranscription.id }];
    }

    if (newTranscription.eventType === EventModel.EventType.onTheRecord && isRecording) {
        return transcriptionsCopy.length > 0
            ? [
                  ...transcriptionsCopy.slice(0, transcriptionsCopy.length - 1),
                  { ...transcriptionsCopy[transcriptionsCopy.length - 1], to: newTranscription.creationDate },
              ]
            : [];
    }
    if (newTranscription.text === "" || !isRecording) return transcriptionsCopy;

    const isTranscriptionInArray = transcriptionsCopy.findIndex((item) => item.id === newTranscription.id);

    if (isTranscriptionInArray !== -1) {
        transcriptionsCopy[isTranscriptionInArray] = newTranscription;
    } else {
        transcriptionsCopy.push(newTranscription);
    }

    return transcriptionsCopy;
};
