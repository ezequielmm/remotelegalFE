import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../state/GlobalState";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default (isAudioEnabled: boolean, audioTracks) => {
    const [recorder, setRecorder] = useState(null);
    const { state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;
    const [sampleRate, setSampleRate] = useState<number>(undefined);
    const [stopAudio, transcriptAudio] = useTranscriptAudio();

    const stopMicrophone = useCallback(async () => {
        if (recorder) {
            if (sampleRate) {
                setTimeout(() => {
                    stopAudio(sampleRate);
                }, 500);
            }
        }
    }, [stopAudio, sampleRate, recorder]);

    useEffect(() => {
        return () => {
            if (recorder) {
                recorder.stop();
                recorder.stream.getTracks().forEach((track) => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder && isRecording && isAudioEnabled) {
            dataAvailableHandler = (e) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const buffer: ArrayBuffer =
                        typeof event.target.result !== "string" ? event.target.result : new ArrayBuffer(0);
                    const newSampleRate = new Int32Array(buffer.slice(24, 28))[0];
                    const reconnect = newSampleRate !== sampleRate;
                    if (reconnect) {
                        setSampleRate(newSampleRate);
                    }
                    transcriptAudio(buffer, newSampleRate, reconnect);
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
    }, [sampleRate, recorder, transcriptAudio, isRecording, isAudioEnabled]);

    const getMicrophone = useCallback(async () => {
        if (!audioTracks?.length) return;
        const mediaTracks = audioTracks
            .filter((track) => track.kind === "audio")
            .map((trackPublication) => trackPublication?.mediaStreamTrack);

        const stream = new MediaStream(mediaTracks);
        const newRecorder = new AudioRecorder(stream);
        newRecorder.start(1000);
        setRecorder(newRecorder);
        // Start recording
    }, [audioTracks]);

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

    useEffect(() => {
        toggleMicrophone(isRecording && isAudioEnabled);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isAudioEnabled, audioTracks]);

    return toggleMicrophone;
};
