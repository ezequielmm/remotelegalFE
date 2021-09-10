import AudioRecorder from "audio-recorder-polyfill";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/InDepo/InDepoActions";
import { DepositionID } from "../state/types";
import useTranscriptAudio from "./InDepo/useTranscriptAudio";

export default (isAudioEnabled: boolean, audioTracks, doNotConnectToSocket = false) => {
    const [recorder, setRecorder] = useState(null);
    const [sampleRate, setSampleRate] = useState<number>(undefined);
    const { state, dispatch } = useContext(GlobalStateContext);
    const { isRecording, stopRecorder, resetRecorder } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const { transcriptAudio, sendMessage } = useTranscriptAudio(doNotConnectToSocket, sampleRate);
    const recorderRef = useRef(null);

    const stopMicrophone = useCallback(async () => {
        recorder?.stop();
    }, [recorder]);

    useEffect(() => {
        let interval;
        const AvailableAudioContext =
            window.AudioContext || // Default
            (window as any).webkitAudioContext; // Safari and old versions of Chrome
        const audioCtx = AvailableAudioContext && new AvailableAudioContext();
        let noise;
        if (isRecording && !isAudioEnabled && AvailableAudioContext && sendMessage && depositionID) {
            if (!sampleRate) {
                sendMessage("InitializeRecognition", {
                    depositionId: depositionID,
                    sampleRate: 48000, // Hardcoded value just to reset
                });
            }
            const createNoise = () => {
                const channels = 2;
                const frameCount = audioCtx.sampleRate * 2.0;
                const myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);
                let nowBuffering;
                // eslint-disable-next-line no-plusplus
                for (let channel = 0; channel < channels; channel++) {
                    nowBuffering = myArrayBuffer.getChannelData(channel);
                    // eslint-disable-next-line no-plusplus
                    for (let i = 0; i < frameCount; i++) {
                        nowBuffering[i] = Math.random() * 2 - 1;
                    }
                }
                return nowBuffering;
            };
            noise = createNoise();
        }
        if (noise) {
            interval = setInterval(() => transcriptAudio(noise, !sampleRate ?? 48000), 120000);
        }
        return () => {
            clearInterval(interval);
            audioCtx?.close();
        };
    }, [isRecording, isAudioEnabled, transcriptAudio, sendMessage, depositionID, sampleRate]);

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
                        sendMessage("InitializeRecognition", {
                            depositionId: depositionID,
                            sampleRate: newSampleRate,
                        });
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
    }, [recorder, transcriptAudio, isRecording, isAudioEnabled, sampleRate, sendMessage, depositionID]);

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

    const restartRecorder = () => {
        if (recorder) {
            recorder.stop();
            recorder.stream.getTracks().forEach((track) => track.stop());
        }
        const mediaTracks = audioTracks
            .filter((track) => track.kind === "audio")
            .map((trackPublication) => trackPublication?.mediaStreamTrack);
        const stream = new MediaStream(mediaTracks);
        const newRecorder = new AudioRecorder(stream);
        newRecorder.start(1000);
        dispatch(actions.resetRecorder(false));
        return setRecorder(newRecorder);
    };

    const toggleMicrophone = (start) => {
        if (!start && !resetRecorder) {
            stopMicrophone();
        }
        if (start && resetRecorder) {
            restartRecorder();
        } else if (start) {
            getMicrophone();
        }
    };

    useEffect(() => {
        toggleMicrophone(isRecording && isAudioEnabled && !stopRecorder && audioTracks.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isAudioEnabled, audioTracks, resetRecorder, stopRecorder]);

    return toggleMicrophone;
};
