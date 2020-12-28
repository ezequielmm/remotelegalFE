import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useState } from "react";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

// AudioRecorder.encoder = mpegEncoder;
// AudioRecorder.prototype.mimeType = "audio/mpeg";

export default () => {
    const [recorder, setRecorder] = useState(null);
    const [transcriptAudio] = useTranscriptAudio();

    const stopMicrophone = useCallback(() => {
        if (recorder) recorder.stop();
    }, [recorder]);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder) {
            dataAvailableHandler = (e) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    transcriptAudio(event.target.result);
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
