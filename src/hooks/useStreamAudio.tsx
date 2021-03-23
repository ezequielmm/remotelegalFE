import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useEffect, useState } from "react";
import useSendParticipantStatus from "./InDepo/useSendParticipantStatus";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default () => {
    const [recorder, setRecorder] = useState(null);
    const [sampleRate, setSampleRate] = useState<number>(undefined);
    const [stopAudio, transcriptAudio] = useTranscriptAudio();
    const [sendToggledMuted] = useSendParticipantStatus();

    const stopMicrophone = useCallback(async () => {
        if (recorder) {
            recorder.stop();
            if (sampleRate) {
                sendToggledMuted(true);
                setTimeout(() => {
                    stopAudio(sampleRate);
                }, 500);
            }
        }
    }, [stopAudio, sampleRate, recorder, sendToggledMuted]);

    useEffect(() => {
        return () => {
            if (recorder) {
                recorder.stop();
                recorder.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [recorder]);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder) {
            dataAvailableHandler = (e) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const buffer: ArrayBuffer =
                        typeof event.target.result !== "string" ? event.target.result : new ArrayBuffer(0);
                    const newSampleRate = new Int32Array(buffer.slice(24, 28))[0];
                    if (newSampleRate !== sampleRate) setSampleRate(newSampleRate);
                    transcriptAudio(buffer, newSampleRate);
                };
                fileReader.readAsArrayBuffer(e.data);
            };
            recorder.addEventListener("dataavailable", dataAvailableHandler);
        }
        return () => {
            if (dataAvailableHandler) {
                recorder.removeEventListener("dataavailable", dataAvailableHandler);
            }
        };
    }, [sampleRate, recorder, transcriptAudio]);

    const getMicrophone = useCallback(async () => {
        if (recorder) recorder.start(1000);
        const newAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        if (!newAudio) return;

        const newRecorder = new AudioRecorder(newAudio);
        newRecorder.start(1000);

        setRecorder(newRecorder);
        sendToggledMuted(false);

        // Start recording
    }, [recorder, sendToggledMuted]);

    const toggleMicrophone = useCallback(
        (start) => {
            if (!start) {
                stopMicrophone();
            } else {
                getMicrophone();
            }
        },
        [stopMicrophone, getMicrophone]
    );

    return toggleMicrophone;
};
