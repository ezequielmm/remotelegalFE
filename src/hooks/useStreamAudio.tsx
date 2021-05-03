import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../state/GlobalState";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default (isAudioEnabled: boolean) => {
    const [recorder, setRecorder] = useState(null);
    const { state } = useContext(GlobalStateContext);
    const { isMuted, isRecording } = state.room;
    const [sampleRate, setSampleRate] = useState<number>(undefined);
    const [stopAudio, transcriptAudio] = useTranscriptAudio();
    const [isStartCompleted, setIsStartCompleted] = useState(false);

    const muteRecorderTracks = useCallback(() => {
        recorder?.stop();
        recorder?.stream?.getTracks()?.forEach((track) => {
            track.enabled = false;
            track.stop();
        });
    }, [recorder]);

    const stopMicrophone = useCallback(async () => {
        if (recorder) {
            muteRecorderTracks();
            if (sampleRate) {
                setTimeout(() => {
                    stopAudio(sampleRate);
                }, 500);
            }
        }
    }, [stopAudio, sampleRate, recorder, muteRecorderTracks]);

    useEffect(() => {
        return () => {
            muteRecorderTracks();
        };
    }, [muteRecorderTracks]);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder) {
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
    }, [sampleRate, recorder, transcriptAudio]);

    const getMicrophone = useCallback(async () => {
        const newAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        if (!newAudio) return;

        setIsStartCompleted(false);
        const newRecorder = new AudioRecorder(newAudio);
        if (!isMuted) newRecorder.start(1000);
        setIsStartCompleted(true);
        setRecorder(newRecorder);

        // Start recording
    }, [isMuted]);

    useEffect(() => {
        if (recorder && isStartCompleted && isMuted) {
            muteRecorderTracks();
        } else if (recorder && isStartCompleted) {
            recorder?.start(1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMuted]);

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
    }, [isRecording, isAudioEnabled]);

    return toggleMicrophone;
};
