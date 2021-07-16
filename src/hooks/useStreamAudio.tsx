import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GlobalStateContext } from "../state/GlobalState";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default (isAudioEnabled: boolean, audioTracks, doNotConnectToSocket = false) => {
    const [recorder, setRecorder] = useState(null);
    const { state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;
    const [sampleRate, setSampleRate] = useState<number>(undefined);
    const transcriptAudio = useTranscriptAudio(doNotConnectToSocket);
    const recorderRef = useRef(null);
    const stopMicrophone = useCallback(async () => {
        if (recorder) {
            recorder.stop();
            if (sampleRate) {
                transcriptAudio("", sampleRate);
            }
        }
    }, [transcriptAudio, sampleRate, recorder]);

    useEffect(() => {
        const innerRef = recorderRef;
        return () => {
            if (innerRef?.current) {
                innerRef.current.stop();
                innerRef.current.stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (recorder) {
            recorderRef.current = recorder;
        }
    }, [recorder]);

    React.useEffect(() => {
        let dataAvailableHandler;
        if (recorder && isRecording && isAudioEnabled) {
            dataAvailableHandler = (e) => {
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    const buffer: ArrayBuffer =
                        typeof event.target.result !== "string" ? event.target.result : new ArrayBuffer(0);
                    const newSampleRate = new Int32Array(buffer.slice(24, 28))[0];
                    const isSampleRateDifferent = newSampleRate !== sampleRate;
                    if (isSampleRateDifferent) {
                        setSampleRate(newSampleRate);
                    }
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
    }, [sampleRate, recorder, transcriptAudio, isRecording, isAudioEnabled]);

    const getMicrophone = () => {
        if (recorder) {
            return recorder.start(1000);
        }
        if (audioTracks.length) {
            const mediaTracks = audioTracks
                .filter((track) => track.kind === "audio")
                .map((trackPublication) => trackPublication?.mediaStreamTrack);

            const stream = new MediaStream(mediaTracks);
            const newRecorder = new AudioRecorder(stream);
            newRecorder.start(1000);
            return setRecorder(newRecorder);
        }

        return null;
    };

    const toggleMicrophone = (start) => {
        if (!start) {
            stopMicrophone();
        } else {
            getMicrophone();
        }
    };

    useEffect(() => {
        toggleMicrophone(isRecording && isAudioEnabled);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isAudioEnabled, audioTracks]);

    return toggleMicrophone;
};
