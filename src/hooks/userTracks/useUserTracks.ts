import { useCallback, useEffect, useRef, useState } from "react";
import stopAllTracks from "../../helpers/stopAllTracks";
import { listDevices } from "../../helpers/tracks/userTracks";

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
    groupId: string;
};
export enum MediaStreamTypes {
    audioinput = "audio",
    videoinput = "video",
}

export const MediaStreamConstraints = {
    audioinput: {},
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

const useUserTracks = (getTracks: boolean = true, shouldUseCurrentStream = false) => {
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

    const stopOldTrackAndSetNewTrack = useCallback(async (incomingStream: StreamOption, doNotKill?) => {
        let oldErrorsFiltered = [];
        if (errorsRef.current.length) {
            oldErrorsFiltered = errorsRef.current.filter((error) => !error[incomingStream.kind]);
            setErrors(oldErrorsFiltered);
        }
        const { stream } = activeStreamsRef.current[incomingStream.kind];
        if (stream) {
            if (!doNotKill) {
                stopAllTracks(stream.getTracks());
            }
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
        return () => {
            if (getTracks) {
                if (!shouldUseCurrentStream) {
                    Object.values(activeStreamsRef.current).forEach((track) =>
                        stopAllTracks(track.stream?.getTracks())
                    );
                }
                setErrors([]);
            }
        };
    }, [getTracks, shouldUseCurrentStream]);

    const loadUserStreams = useCallback(
        async (audioStream, videoStream) => {
            const previouslySelectedDevices =
                localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices"));
            const wasVideoSelected = previouslySelectedDevices?.video;
            const wasAudioSelected = previouslySelectedDevices?.audio;
            const wasSpeakersSelected = previouslySelectedDevices?.speakers;
            const getInitialStream = async (types: StreamOption["kind"][], constraints) => {
                try {
                    const currentStreams = {
                        audioinput: audioStream,
                        videoinput: videoStream,
                    };
                    if (shouldUseCurrentStream && (!currentStreams.audioinput || !currentStreams.videoinput)) return;
                    let stream = !shouldUseCurrentStream && (await navigator.mediaDevices.getUserMedia(constraints));
                    const updatedTypes = {};
                    types.forEach((type) => {
                        stream = shouldUseCurrentStream ? currentStreams[type] : stream;
                        updatedTypes[type] = { stream };
                    });
                    setActiveStreams((oldActiveStreams) => ({ ...oldActiveStreams, ...updatedTypes }));
                } catch (error) {
                    const errorsTypes = types.map((type) => ({
                        [type]: error,
                    }));
                    setErrors((oldErrors) => [...oldErrors, ...errorsTypes]);
                }
            };
            const videoConstrain = wasVideoSelected
                ? { video: wasVideoSelected }
                : {
                      video: { ...MediaStreamConstraints.videoinput },
                  };
            const audioConstrain = wasAudioSelected
                ? { audio: wasAudioSelected }
                : {
                      audio: { ...MediaStreamConstraints.audioinput },
                  };
            await getInitialStream(["videoinput", "audioinput"], { ...videoConstrain, ...audioConstrain });
            const initialOptions = await listDevices();
            setOptions(initialOptions);
            const firstSpeakerOption = initialOptions.audiooutput[0] as StreamOption;
            if (initialOptions.audiooutput[0] === "-" || firstSpeakerOption?.value === "") {
                initialOptions.audiooutput = [
                    {
                        value: "",
                        label: "Default Speakers",
                        kind: "audiooutput",
                        groupId: "",
                    },
                ];
            }
            const videoInputArray = initialOptions.videoinput as StreamOption[];
            const audioInputArray = initialOptions.audioinput as StreamOption[];
            const speakerArray = initialOptions.audiooutput as StreamOption[];
            const previouslySelectedVideo = videoInputArray.find(
                (input) => input?.value === wasVideoSelected?.deviceId?.exact
            );
            const previouslySelectedAudio = audioInputArray.find(
                (input) => input?.value === wasAudioSelected?.deviceId?.exact
            );
            const previouslySelectedSpeaker = speakerArray.find((input) => input?.value === wasSpeakersSelected);
            setSelectedOptions({
                videoinput: previouslySelectedVideo || initialOptions.videoinput[0],
                audioinput: previouslySelectedAudio || initialOptions.audioinput[0],
                audiooutput: previouslySelectedSpeaker || initialOptions.audiooutput[0],
            });
            setGettingTracks(false);
            if (!shouldUseCurrentStream) {
                navigator.mediaDevices.ondevicechange = listDevices;
            }
        },
        [shouldUseCurrentStream]
    );

    const stopExampleTrack = useCallback(() => {
        const { stream } = activeStreamsRef.current.audioinput;
        if (stream) {
            stopAllTracks(stream.getTracks());
        }
    }, []);

    return {
        errors,
        activeStreams,
        stopOldTrackAndSetNewTrack,
        options,
        setSelectedOptions,
        selectedOptions,
        gettingTracks,
        loadUserStreams,
        stopExampleTrack,
    };
};
export default useUserTracks;
