import { useCallback, useEffect, useRef, useState } from "react";
import stopAllTracks from "../helpers/stopAllTracks";

export type Options = null | {
    videoinput: string[] | StreamOption[];
    audioinput: string[] | StreamOption[];
    audiooutput: string[] | StreamOption[];
};
export type SelectedOptions = null | {
    videoinput: string | StreamOption;
    audioinput: string | StreamOption;
    audiooutput: string | StreamOption;
};
export type ActiveStream = null | MediaStream;
export type StreamOption = {
    label: string;
    kind: "audioinput" | "videoinput" | "audiooutput";
    value: string;
};
export enum MediaStreamTypes {
    audioinput = "audio",
    videoinput = "video",
}

export const MediaStreamConstraints = {
    audioinput: {
        echoCancellation: true,
        noiseSuppression: true,
    },
    videoinput: {
        aspectRatio: 1.777777777777778,
        facingMode: "user",
    },
};

export type ActiveStreamsState = {
    audioinput: {
        stream: ActiveStream | null;
    };
    videoinput: {
        stream: ActiveStream | null;
    };
    audiooutput: {
        stream: ActiveStream | null;
    };
};

const useUserTracks = () => {
    const [gettingTracks, setGettingTracks] = useState(true);
    const [activeStreams, setActiveStreams] = useState<ActiveStreamsState>({
        audioinput: {
            stream: null,
        },
        videoinput: {
            stream: null,
        },
        audiooutput: {
            stream: null,
        },
    });
    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(null);
    const [options, setOptions] = useState<Options>(null);
    const [errors, setErrors] = useState([]);
    const activeStreamsRef = useRef(activeStreams);
    const errorsRef = useRef(errors);

    useEffect(() => {
        activeStreamsRef.current = activeStreams;
    }, [activeStreams]);

    useEffect(() => {
        errorsRef.current = errors;
    }, [errors]);

    const stopOldTrackAndSetNewTrack = useCallback(async (incomingStream: StreamOption) => {
        let oldErrorsFiltered = [];
        if (errorsRef.current.length) {
            oldErrorsFiltered = errorsRef.current.filter((error) => !error[incomingStream.kind]);
            setErrors(oldErrorsFiltered);
        }
        const { stream } = activeStreamsRef.current[incomingStream.kind];
        if (stream) {
            stopAllTracks(stream.getTracks());
            setActiveStreams((oldActiveStreams) => ({
                ...oldActiveStreams,
                [incomingStream.kind]: {
                    stream: null,
                },
            }));
        }
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                [MediaStreamTypes[incomingStream.kind]]: {
                    ...MediaStreamConstraints[incomingStream.kind],
                    deviceId: {
                        exact: incomingStream.value,
                    },
                },
            });
            setActiveStreams((oldActiveStreams) => ({
                ...oldActiveStreams,
                [incomingStream.kind]: {
                    stream: newStream,
                },
            }));
        } catch (streamError) {
            setErrors([
                ...oldErrorsFiltered,
                {
                    [incomingStream.kind]: streamError,
                },
            ]);
        }
    }, []);

    useEffect(() => {
        const initialOptions: Options = {
            videoinput: ["-"],
            audioinput: ["-"],
            audiooutput: ["-"],
        };
        const getUserStreams = async () => {
            const getInitialStream = async (type: string, constraints) => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    setActiveStreams((oldActiveStreams) => ({
                        ...oldActiveStreams,
                        [type]: {
                            stream,
                        },
                    }));
                } catch (error) {
                    setErrors((oldErrors) => [
                        ...oldErrors,
                        {
                            [type]: error,
                        },
                    ]);
                }
            };
            await getInitialStream("videoinput", {
                video: { ...MediaStreamConstraints.videoinput },
            });
            await getInitialStream("audioinput", {
                audio: {
                    ...MediaStreamConstraints.audioinput,
                },
            });
            const availableStreams = await navigator.mediaDevices.enumerateDevices();
            availableStreams.forEach((currentStream) => {
                const firstStream = initialOptions[currentStream.kind][0];
                if (firstStream === "-") {
                    initialOptions[currentStream.kind][0] = {
                        label: currentStream.label,
                        kind: currentStream.kind,
                        value: currentStream.deviceId,
                    };
                    return {
                        label: currentStream.label,
                        kind: currentStream.kind,
                        value: currentStream.deviceId,
                    };
                }
                initialOptions[currentStream.kind] = [
                    ...(initialOptions[currentStream.kind] as StreamOption[]),
                    { label: currentStream.label, value: currentStream.deviceId, kind: currentStream.kind },
                ];
                return initialOptions[currentStream.kind];
            });
            const firstSpeakerOption = initialOptions.audiooutput[0] as StreamOption;
            if (initialOptions.audiooutput[0] === "-" || firstSpeakerOption?.value === "") {
                initialOptions.audiooutput = [
                    {
                        value: "",
                        label: "Default Speakers",
                        kind: "audiooutput",
                    },
                ];
            }
            setOptions(initialOptions);
            setSelectedOptions({
                videoinput: initialOptions.videoinput[0],
                audioinput: initialOptions.audioinput[0],
                audiooutput: initialOptions.audiooutput[0],
            });
            setGettingTracks(false);
        };
        getUserStreams();
        return () => {
            Object.values(activeStreamsRef.current).forEach((track) => stopAllTracks(track.stream?.getTracks()));
        };
    }, []);

    return {
        errors,
        activeStreams,
        stopOldTrackAndSetNewTrack,
        options,
        setSelectedOptions,
        selectedOptions,
        gettingTracks,
    };
};
export default useUserTracks;
