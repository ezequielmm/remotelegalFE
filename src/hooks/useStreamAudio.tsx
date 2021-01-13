import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useEffect, useState } from "react";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default () => {
    const [recorder, setRecorder] = useState(null);
    const transcriptAudio = useTranscriptAudio();

    useEffect(() => {
        return () => {
            if (recorder) recorder.stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stopMicrophone = useCallback(() => {
        if (recorder) recorder.stop();
    }, [recorder]);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder) {
            dataAvailableHandler = (e) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const buffer: ArrayBuffer =
                        typeof event.target.result !== "string" ? event.target.result : new ArrayBuffer(0);
                    const sampleRate = new Int32Array(buffer.slice(24, 28))[0];
                    transcriptAudio(buffer, sampleRate);
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
    }, [recorder, transcriptAudio]);

    const getMicrophone = useCallback(async () => {
        const newAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        if (!newAudio) return;

        const newRecorder = new AudioRecorder(newAudio);
        newRecorder.start(1000);

        setRecorder(newRecorder);

        // Start recording
    }, []);

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
