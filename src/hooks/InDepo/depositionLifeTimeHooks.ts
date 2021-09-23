import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { connect, createLocalAudioTrack, createLocalVideoTrack, LocalDataTrack, Room, Logger } from "twilio-video";
import { useHistory, useParams } from "react-router";
import { isMobile as isDeviceMobileOrTablet } from "react-device-detect";
import useSound from "use-sound";
import { GlobalStateContext } from "../../state/GlobalState";
import configParticipantListeners from "../../helpers/configParticipantListeners";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/InDepo/InDepoActions";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import useDepositionPermissions from "./useDepositionPermissions";
import { DepositionID } from "../../state/types";
import useGetTranscriptions from "./useGetTranscriptions";
import useGetEvents from "./useGetEvents";
import { useExhibitFileInfo } from "../exhibits/hooks";
import useGetBreakrooms from "./useGetBreakrooms";
import { TWILIO_MOBILE_CONFIG, TWILIO_VIDEO_CONFIG } from "../../constants/inDepo";
import { useCheckUserStatus } from "../preJoinDepo/hooks";
import { Roles } from "../../models/participant";
import { useAuthentication } from "../auth";
import stopAllTracks from "../../helpers/stopAllTracks";
import beep from "../../assets/sounds/Select.mp3";
import useSendSystemUserInfo from "../techInfo/useSendUserSystemInfo";
import useSendParticipantDevices from "../techInfo/sendParticipantDevices";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { TranscriptionModel } from "../../models";
import { useSystemSetting } from "./useSystemSettings";
import { DevicesStatus } from "../../constants/TroubleShootUserDevices";

export const useKillDepo = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async () => {
        const response = await deps.apiService.endDeposition(depositionID);
        return response;
    }, [depositionID]);
};

export const useGenerateDepositionToken = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async () => {
        const response = await deps.apiService.joinDeposition(depositionID);
        return response;
    }, []);
};

const useGenerateBreakroomToken = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID, breakroomID } = useParams<{ depositionID: string; breakroomID: string }>();
    return useAsyncCallback(() => deps.apiService.joinBreakroom(depositionID, breakroomID), []);
};

export const useJoinBreakroom = () => {
    const [breakroom, setBreakroom] = useState<Room>(undefined);
    const { dispatch } = useContext(GlobalStateContext);
    const [generateBreakroomToken, , errorGeneratingToken] = useGenerateBreakroomToken();
    const [getBreakrooms] = useGetBreakrooms();
    const isMounted = useRef(true);
    const [play] = useSound(beep);

    useEffect(() => {
        return () => {
            if (breakroom) return disconnectFromDepo(breakroom, dispatch);
            return null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakroom]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const joinBreakroomAsync = useAsyncCallback(
        async (breakroomID: string) => {
            const devices = JSON.parse(localStorage.getItem("selectedDevices"));
            const dataTrack = new LocalDataTrack();
            const tracks = [];
            const token: any = await generateBreakroomToken();
            if (!token) return "";
            try {
                if (devices?.audio) {
                    const audioTrack = await createLocalAudioTrack(devices.audio);
                    tracks.push(audioTrack);
                }
            } catch (error) {
                console.error(
                    `(useJoinBreakroom hook) error creating local audio track of breakroom ${breakroomID}:`,
                    error
                );
            }
            try {
                if (devices?.video) {
                    const videoTrack = await createLocalVideoTrack(devices.video);
                    tracks.push(videoTrack);
                }
            } catch (error) {
                console.error(
                    `(useJoinBreakroom hook) error creating local video track of breakroom ${breakroomID}:`,
                    error
                );
            }
            tracks.push(dataTrack);

            const room = await connect(token, {
                ...TWILIO_VIDEO_CONFIG,
                name: breakroomID,
                tracks,
                networkQuality: { local: 3, remote: 3 },
            });

            dispatch(actions.addUserTracks(tracks));
            setBreakroom(room);

            const breakrooms = await getBreakrooms();
            dispatch(actions.setBreakrooms(breakrooms || []));

            if (!isMounted.current) {
                stopAllTracks(tracks);
                return disconnectFromDepo(room, dispatch);
            }
            dispatch(actions.joinToBreakroom(room));
            dispatch(actions.addBreakroomDataTrack(dataTrack));
            return configParticipantListeners(
                room,
                (callbackRoom) => {
                    play();
                    dispatch(actions.addRemoteParticipantBreakroom(callbackRoom));
                },
                (callbackRoom) => dispatch(actions.removeRemoteParticipantBreakroom(callbackRoom))
            );
        },
        [play]
    );

    return useMemo(() => [...joinBreakroomAsync, errorGeneratingToken], [joinBreakroomAsync, errorGeneratingToken]);
};

export const useJoinDepositionForMockRoom = () => {
    const { dispatch } = useContext(GlobalStateContext);
    const [generateToken] = useGenerateDepositionToken();
    const [getBreakrooms] = useGetBreakrooms();
    const [getSystemSettings] = useSystemSetting();
    const isMounted = useRef(true);
    const [play] = useSound(beep);

    const history = useHistory();
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useAsyncCallback(
        async (depositionID: string, isMobile: boolean) => {
            const devices = JSON.parse(localStorage.getItem("selectedDevices"));
            const dataTrack = new LocalDataTrack();
            const tracks = [];
            const selectedTwilioConfig = isMobile ? TWILIO_MOBILE_CONFIG : TWILIO_VIDEO_CONFIG;
            const { token, participants, shouldSendToPreDepo, startDate, jobNumber }: any = await generateToken();
            const breakrooms = await getBreakrooms();
            if (!shouldSendToPreDepo) {
                history.push(`/deposition/join/${depositionID}`);
            }
            const settings = await getSystemSettings();
            dispatch(actions.setSystemSettings(settings));
            try {
                if (devices?.audio) {
                    const audioTrack = await createLocalAudioTrack(devices.audio);
                    tracks.push(audioTrack);
                }
            } catch (error) {
                console.error(
                    `(useJoinDepositionForMockRoom hook) error creating local audio track of deposition ${depositionID}:`,
                    error
                );
            }
            try {
                if (devices?.video) {
                    const videoTrack = await createLocalVideoTrack(devices.video);
                    tracks.push(videoTrack);
                }
            } catch (error) {
                console.error(
                    `(useJoinDepositionForMockRoom hook) error creating local video track of deposition ${depositionID}:`,
                    error
                );
            }
            tracks.push(dataTrack);
            const room = await connect(token, {
                ...selectedTwilioConfig,
                name: depositionID,
                tracks,
            });

            if (settings.EnableTwilioLogs === "enabled") {
                const logger = Logger.getLogger("twilio-video");
                const originalFactory = logger.methodFactory;
                logger.methodFactory = (methodName, logLevel, loggerName) => {
                    const method = originalFactory(methodName, logLevel, loggerName);
                    return (datetime, logLevel, component, message, data) => {
                        method(datetime, logLevel, component, message, data);
                        if (message === "event" && data.group === "signaling") {
                            if (data.name === "closed") {
                                if (data.level === "error") {
                                    console.error(
                                        "Connection to Twilio's signaling server abruptly closed:",
                                        data.reason
                                    );
                                }
                            }
                        }
                    };
                };
                logger.setLevel("debug");
            }

            dispatch(actions.addUserTracks(tracks));

            if (!isMounted.current) {
                stopAllTracks(tracks);
                return disconnectFromDepo(room, dispatch);
            }
            dispatch(actions.setBreakrooms(breakrooms || []));
            dispatch(actions.setDepoStartTime(startDate));
            dispatch(actions.setMockRoom(room));
            dispatch(actions.setParticipantsData(participants));
            dispatch(actions.addDataTrack(dataTrack));
            dispatch(actions.setJobNumber(jobNumber));
            return configParticipantListeners(
                room,
                (callbackRoom) => {
                    play();
                    dispatch(actions.addRemoteParticipant(callbackRoom));
                },
                (callbackRoom) => dispatch(actions.removeRemoteParticipant(callbackRoom))
            );
        },
        [play]
    );
};

export const useJoinDeposition = (setTranscriptions: React.Dispatch<TranscriptionModel.Transcription[]>) => {
    const [depoRoom, setDepoRoom] = useState<Room>(undefined);
    const { dispatch } = useContext(GlobalStateContext);
    const [generateToken] = useGenerateDepositionToken();
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const isMounted = useRef(true);
    const [play] = useSound(beep);

    useEffect(() => {
        return () => {
            if (depoRoom) return disconnectFromDepo(depoRoom, dispatch);
            return null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depoRoom]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [sendUserSystemInfo, , sendSystemUserInfoError] = useSendSystemUserInfo();
    const [getSystemSettings] = useSystemSetting();
    const [sendParticipantDevices, , sendParticipantDevicesError] = useSendParticipantDevices();
    const [getDepositionPermissions] = useDepositionPermissions();
    const [getTranscriptions] = useGetTranscriptions();
    const [getBreakrooms] = useGetBreakrooms();
    const [getDepositionEvents] = useGetEvents();
    const [checkUserStatus] = useCheckUserStatus();
    const history = useHistory();
    const { currentEmail } = useAuthentication();
    const devices = JSON.parse(localStorage.getItem("selectedDevices"));
    return useAsyncCallback(
        async (depositionID: string, isMobile: boolean) => {
            const participantDevices = {
                camera: {
                    name: devices?.videoForBE.name || "",
                    status: devices?.videoForBE.status,
                },
                microphone: {
                    name: devices?.microphoneForBE.name || "",
                },
                speakers: {
                    name: devices?.speakersForBE.name || "",
                },
            };
            try {
                await sendUserSystemInfo();
            } catch {
                console.error(
                    `Couldn't send system user info of deposition ${depositionID} because of: ${sendSystemUserInfoError}`
                );
            }
            try {
                await sendParticipantDevices(participantDevices);
            } catch {
                console.error(
                    `Couldn't send system user info of deposition ${depositionID} because of: ${sendParticipantDevicesError}`
                );
            }
            const selectedTwilioConfig = isMobile ? TWILIO_MOBILE_CONFIG : TWILIO_VIDEO_CONFIG;
            const dataTrack = new LocalDataTrack();
            const userStatus = await checkUserStatus(depositionID, currentEmail.current);
            dispatch(actions.setUserStatus(userStatus));
            const { isOnTheRecord, timeZone, token, isSharing, participants, shouldSendToPreDepo, jobNumber }: any =
                await generateToken();
            dispatch(actions.setDepoStatus(shouldSendToPreDepo));
            dispatch(actions.setJobNumber(jobNumber));

            if (shouldSendToPreDepo && userStatus.participant?.role !== Roles.courtReporter) {
                return history.push(`/deposition/pre/${depositionID}`);
            }

            if (!shouldSendToPreDepo && !userStatus.participant?.isAdmitted) {
                return history.push(`/deposition/pre/${depositionID}/waiting`);
            }

            const { permissions } = await getDepositionPermissions();
            const transcriptions = !isDeviceMobileOrTablet ? await getTranscriptions() : [];
            const breakrooms = await getBreakrooms();
            const events = await getDepositionEvents(depositionID);
            const settings = await getSystemSettings();
            dispatch(actions.setSystemSettings(settings));

            const sendUserAudioInfoWhenFailedToProduceTracks = async (error) => {
                console.error(
                    `useJoinDeposition hook: error creating local audio track of deposition ${depositionID}:`,
                    error
                );
                const newDevicesBody = {
                    ...participantDevices,
                    microphone: {
                        ...participantDevices.microphone,
                        name: "",
                    },
                };
                try {
                    await sendParticipantDevices(newDevicesBody);
                } catch {
                    console.error(
                        `Couldn't send system user info of deposition ${depositionID} because of: ${sendParticipantDevicesError}`
                    );
                }
            };
            const tracks = [];
            if (isSharing) {
                fetchExhibitFileInfo(depositionID);
            }
            try {
                if (devices?.audio) {
                    const audioTrack = await createLocalAudioTrack(devices.audio);
                    tracks.push(audioTrack);
                }
            } catch (error) {
                if (error.message === "Permission denied") {
                    await sendUserAudioInfoWhenFailedToProduceTracks(error);
                } else {
                    try {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        const audioTrack = await createLocalAudioTrack();
                        const oldDevices = JSON.parse(localStorage.getItem("selectedDevices"));
                        if (oldDevices) {
                            const newDevices = {
                                ...oldDevices,
                                microphoneForBE: {
                                    name: devices[0].label,
                                },
                                audio: {
                                    label: devices[0].label,
                                    groupId: devices[0].groupId,
                                    deviceId: {
                                        exact: devices[0].deviceId,
                                    },
                                },
                            };
                            localStorage.setItem("selectedDevices", JSON.stringify(newDevices));
                        }
                        tracks.push(audioTrack);
                    } catch (error) {
                        await sendUserAudioInfoWhenFailedToProduceTracks(error);
                    }
                }
            }
            try {
                if (devices?.video) {
                    const videoTrack = await createLocalVideoTrack(devices.video);
                    tracks.push(videoTrack);
                }
            } catch (error) {
                console.error(
                    `useJoinDeposition hook: error creating local video track of deposition ${depositionID}:`,
                    error
                );
                const newDevicesBody = {
                    ...participantDevices,
                    camera: {
                        ...participantDevices.camera,
                        name: "",
                        status:
                            error.message === "Permission denied" ? DevicesStatus.blocked : DevicesStatus.unavailable,
                    },
                };
                try {
                    await sendParticipantDevices(newDevicesBody);
                } catch {
                    console.error(
                        `Couldn't send system user info of deposition ${depositionID} because of: ${sendParticipantDevicesError}`
                    );
                }
            }
            if (settings.EnableTwilioLogs === "enabled") {
                const logger = Logger.getLogger("twilio-video");
                const originalFactory = logger.methodFactory;
                logger.methodFactory = (methodName, logLevel, loggerName) => {
                    const method = originalFactory(methodName, logLevel, loggerName);
                    return (datetime, logLevel, component, message, data) => {
                        method(datetime, logLevel, component, message, data);
                        if (message === "event" && data.group === "signaling") {
                            if (data.name === "closed") {
                                if (data.level === "error") {
                                    console.error(
                                        "Connection to Twilio's signaling server abruptly closed:",
                                        data.reason
                                    );
                                }
                            }
                        }
                    };
                };
                logger.setLevel("debug");
            }
            dispatch(actions.setToken(token));
            tracks.push(dataTrack);
            const room = await connect(token, {
                ...selectedTwilioConfig,
                name: depositionID,
                tracks,
            });
            dispatch(actions.addUserTracks(tracks));
            setDepoRoom(room);
            if (!isMounted.current) {
                stopAllTracks(tracks);
                return disconnectFromDepo(room, dispatch);
            }

            dispatch(actions.joinToRoom(room));
            dispatch(actions.setParticipantsData(participants));
            dispatch(actions.setIsRecording(isOnTheRecord));
            dispatch(actions.setPermissions(permissions));
            dispatch(actions.setBreakrooms(breakrooms || []));
            dispatch(actions.setTimeZone(timeZone));
            dispatch(actions.addDataTrack(dataTrack));
            setTranscriptions(setTranscriptionMessages(transcriptions, events));
            return configParticipantListeners(
                room,
                (callbackRoom) => {
                    play();
                    dispatch(actions.addRemoteParticipant(callbackRoom));
                },
                (callbackRoom) => dispatch(actions.removeRemoteParticipant(callbackRoom))
            );
        },
        [play]
    );
};
