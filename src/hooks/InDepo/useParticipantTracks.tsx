import { useContext, useEffect, useRef, useState } from "react";
import {
    AudioTrack,
    DataTrack,
    LocalAudioTrack,
    LocalDataTrack,
    LocalParticipant,
    LocalTrack,
    RemoteDataTrack,
    RemoteParticipant,
    RemoteVideoTrack,
    VideoTrack,
} from "twilio-video";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import changeSpeakers from "../../helpers/changeSpeakers";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import useFloatingAlertContext from "../useFloatingAlertContext";
import { MediaStreamTypes } from "../userTracks/useUserTracks";
import debounce from "../../helpers/debounce";

const useParticipantTracks = (participant: LocalParticipant | RemoteParticipant, isLocal?: boolean) => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { newSpeaker, changeVideoSource, changeAudioSource } = state.room;
    const [dataTracks, setDataTracks] = useState<DataTrack[]>([]);
    const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [netWorkLevel, setNetWorkLevel] = useState<number>(null);
    const audioRef = useRef<HTMLAudioElement & AudioTrack>();
    const videoRef = useRef<HTMLVideoElement & VideoTrack>();
    const changedAudioDeviceIdRef = useRef({ groupId: "", label: "" });
    const localParticipantVideoTrackRef = useRef<VideoTrack>(null);
    const addAlert = useFloatingAlertContext();
    const userDevicesRef = useRef<string[]>([]);

    useEffect(() => {
        const getUserDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const microphones = devices.filter((device) => device.kind === "audioinput");
                const microphonesLabels = microphones.map((item) => item.label);
                userDevicesRef.current = microphonesLabels;
            } catch (error) {
                console.log(error);
            }
        };
        if (participant && isLocal) {
            const selectedAudioDevice = JSON.parse(localStorage.getItem("selectedDevices"))?.audio;
            if (selectedAudioDevice) {
                changedAudioDeviceIdRef.current = {
                    label: selectedAudioDevice.label,
                    groupId: selectedAudioDevice.groupId,
                };
            }
            getUserDevices();
        }
    }, [isLocal, participant]);

    useEffect(() => {
        if (participant && addAlert && isLocal) {
            const getPluggedInDeviceOrDefault = async () => {
                try {
                    const newDevices = await navigator.mediaDevices.enumerateDevices();
                    const newMicrophones = newDevices.filter((newDevice) => newDevice.kind === "audioinput");
                    const newLabels = newMicrophones.map((microphone) => microphone.label);
                    const differences = newLabels.filter(
                        (label) =>
                            !userDevicesRef.current.includes(label) && label !== changedAudioDeviceIdRef.current.label
                    );
                    const oldTrack: LocalAudioTrack | undefined = trackpubsToTracks(participant.audioTracks)[0];
                    const newMicrophone =
                        newMicrophones.find((newMicrophone) => differences.includes(newMicrophone.label)) ||
                        newMicrophones[0];
                    const shouldChangeDevice =
                        newMicrophone && oldTrack && newMicrophone.groupId !== changedAudioDeviceIdRef.current.groupId;
                    if (shouldChangeDevice) {
                        changedAudioDeviceIdRef.current = {
                            label: newMicrophone.label,
                            groupId: newMicrophone.groupId,
                        };
                        const oldDevices = localStorage.getItem("selectedDevices");
                        const { deviceId, label } = newMicrophone;
                        await oldTrack.restart({
                            deviceId,
                        });
                        dispatch(actions.changeAudioDevice(newMicrophone));
                        addAlert({
                            message: `${label} connected`,
                            type: "info",
                            duration: 3,
                            dataTestId: "new_microphone_connected",
                            icon: <Icon icon={UnmuteIcon} />,
                        });
                        if (oldDevices) {
                            const { label, deviceId, groupId } = newMicrophone;
                            const parsedJSON = JSON.parse(oldDevices);
                            const newDevices = {
                                ...parsedJSON,
                                microphoneForBE: {
                                    name: label,
                                },
                                audio: {
                                    label,
                                    deviceId: {
                                        exact: deviceId,
                                    },
                                    groupId,
                                },
                            };
                            localStorage.setItem("selectedDevices", JSON.stringify(newDevices));
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            // We need to debounce this function call, because ondevicechange calls it more than once
            navigator.mediaDevices.ondevicechange = debounce(getPluggedInDeviceOrDefault, 500);
        }
    }, [participant, addAlert, isLocal, dispatch]);

    const trackSubscribed = (track: AudioTrack | VideoTrack | LocalDataTrack | RemoteDataTrack) => {
        if (track.kind === MediaStreamTypes.videoinput) {
            if (videoRef.current) {
                videoRef.current.style.display = "block";
            }
            return setVideoTracks((video) => [...video, track]);
        }
        if (track.kind === MediaStreamTypes.audioinput) {
            return setAudioTracks((audio) => [...audio, track]);
        }
        return setDataTracks((data) => [...data, track]);
    };

    const trackUnsubscribed = (
        track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack
    ) => {
        if (track.kind === MediaStreamTypes.videoinput) {
            if (videoRef.current) {
                videoRef.current.style.display = track.name === videoRef.current.name ? "none" : "block";
            }
            return setVideoTracks((video) => video.filter((v) => v !== track));
        }
        if (track.kind === MediaStreamTypes.audioinput) {
            return setAudioTracks((audio) => audio.filter((a) => a !== track));
        }

        return setDataTracks((data) => data.filter((dt) => dt !== track));
    };

    const trackDisabled = (track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack) => {
        if (track.kind === MediaStreamTypes.videoinput) {
            if (videoRef.current) videoRef.current.style.display = "none";
        }
    };

    const trackEnabled = (track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack) => {
        if (track.kind === MediaStreamTypes.videoinput) {
            if (videoRef.current) videoRef.current.style.display = "block";
        }
    };

    useEffect(() => {
        if (changeVideoSource && participant) {
            setVideoTracks((oldTracks) => [...trackpubsToTracks(participant.videoTracks), ...oldTracks]);
        }
    }, [changeVideoSource, participant]);

    useEffect(() => {
        if (changeAudioSource && participant) {
            setAudioTracks((oldTracks) => [...trackpubsToTracks(participant.audioTracks), ...oldTracks]);
        }
    }, [changeAudioSource, participant]);

    useEffect(() => {
        const resetVideoRefStylesOnReconnection = () => {
            if (videoRef.current) {
                // We have to do this because, for some reason, the reconnected event gets
                // triggered on first load
                if (localParticipantVideoTrackRef.current?.isEnabled) {
                    videoRef.current.style.display = "block";
                }
            }
        };
        const stopRecorder = (track: LocalTrack) => {
            if (track.kind === MediaStreamTypes.audioinput) {
                dispatch(actions.stopRecorder(true));
            }
        };
        const resetRecorder = (track: LocalTrack) => {
            if (track.kind === MediaStreamTypes.audioinput) {
                dispatch(actions.resetRecorder(true));
                dispatch(actions.stopRecorder(false));
            }
        };
        const onReconnecting = (remoteParticipant: RemoteParticipant) => {
            if (videoRef.current) {
                videoRef.current.style.display = participant?.sid === remoteParticipant?.sid ? "none" : "block";
                setVideoTracks((videos) =>
                    videos.filter((v) => remoteParticipant?.videoTracks.size && v !== remoteParticipant.videoTracks[0])
                );
                setAudioTracks((audios) =>
                    audios.filter((a) => remoteParticipant?.audioTracks.size && a !== remoteParticipant.audioTracks[0])
                );
                setDataTracks((dataTracks) =>
                    dataTracks.filter(
                        (d) => remoteParticipant?.dataTracks.size && d !== remoteParticipant.audioTracks[0]
                    )
                );
            }
        };
        if (!participant) {
            return;
        }
        if (addAlert && dispatch) {
            setAudioTracks(trackpubsToTracks(participant.audioTracks));
            setVideoTracks(trackpubsToTracks(participant.videoTracks));
            setDataTracks(trackpubsToTracks(participant.dataTracks));
            participant.on("trackSubscribed", trackSubscribed);
            participant.on("reconnecting", onReconnecting);
            participant.on("reconnected", resetVideoRefStylesOnReconnection);
            participant.on("trackStopped", stopRecorder);
            participant.on("trackStarted", resetRecorder);
            participant.on("networkQualityLevelChanged", setNetWorkLevel);
            participant.on("trackUnsubscribed", trackUnsubscribed);
            participant.on("trackDisabled", trackDisabled);
            participant.on("trackEnabled", trackEnabled);
            // eslint-disable-next-line consistent-return
            return () => {
                participant?.removeAllListeners();
            };
        }
    }, [participant, dispatch, addAlert]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            localParticipantVideoTrackRef.current = videoTrack;
            if (videoRef.current) {
                videoRef.current.name = videoTrack.name;
            }
            videoTrack.attach(videoRef.current);
        }
        return () => {
            videoTrack?.detach();
        };
    }, [videoTracks, participant]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        const speakers =
            localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices")).speakers;

        if (audioTrack) {
            audioTrack.attach(audioRef.current);
        }
        if (speakers) {
            changeSpeakers(audioRef.current, speakers);
        }
        return () => {
            audioTrack?.detach();
        };
    }, [audioTracks, participant]);

    useEffect(() => {
        if (newSpeaker && audioRef.current) {
            changeSpeakers(audioRef.current, newSpeaker);
        }
    }, [newSpeaker]);
    return { videoRef, audioRef, dataTracks, audioTracks, videoTracks, netWorkLevel };
};
export default useParticipantTracks;
