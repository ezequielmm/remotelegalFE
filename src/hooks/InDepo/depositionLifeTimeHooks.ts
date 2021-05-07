import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { connect, createLocalTracks, LocalDataTrack, Room } from "twilio-video";
import { useHistory, useParams } from "react-router";
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
import { TWILIO_VIDEO_CONFIG } from "../../constants/inDepo";
import { useCheckUserStatus } from "../preJoinDepo/hooks";
import { Roles } from "../../models/participant";
import { useAuthentication } from "../auth";

// TODO: Find the way to use import instead of using require
const beep = require("../../assets/sounds/Select.mp3");

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
            const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
            const token: any = await generateBreakroomToken();
            if (!token) return "";

            const tracks = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } });
            tracks.push(dataTrack);
            const room = await connect(token, {
                ...TWILIO_VIDEO_CONFIG,
                name: breakroomID,
                tracks,
            });

            dispatch(actions.addUserTracks(tracks));
            setBreakroom(room);

            const breakrooms = await getBreakrooms();
            dispatch(actions.setBreakrooms(breakrooms || []));

            if (!isMounted.current) {
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
    const isMounted = useRef(true);
    const [play] = useSound(beep);

    const history = useHistory();
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useAsyncCallback(
        async (depositionID: string) => {
            const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
            const { token, participants, shouldSendToPreDepo, startDate, jobNumber }: any = await generateToken();
            const breakrooms = await getBreakrooms();
            if (!shouldSendToPreDepo) {
                history.push(`/deposition/join/${depositionID}`);
            }

            const tracks = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } });
            tracks.push(dataTrack);
            const room = await connect(token, {
                ...TWILIO_VIDEO_CONFIG,
                name: depositionID,
                tracks,
            });

            dispatch(actions.addUserTracks(tracks));

            if (!isMounted.current) {
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

export const useJoinDeposition = () => {
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

    const [getDepositionPermissions] = useDepositionPermissions();
    const [getTranscriptions] = useGetTranscriptions();
    const [getBreakrooms] = useGetBreakrooms();
    const [getDepositionEvents] = useGetEvents();
    const [checkUserStatus] = useCheckUserStatus();
    const history = useHistory();
    const { currentEmail } = useAuthentication();

    return useAsyncCallback(
        async (depositionID: string) => {
            const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
            const userStatus = await checkUserStatus(depositionID, currentEmail.current);
            dispatch(actions.setUserStatus(userStatus));
            const {
                isOnTheRecord,
                timeZone,
                token,
                isSharing,
                participants,
                shouldSendToPreDepo,
                jobNumber,
            }: any = await generateToken();
            dispatch(actions.setDepoStatus(shouldSendToPreDepo));
            dispatch(actions.setJobNumber(jobNumber));

            if (shouldSendToPreDepo && userStatus.participant?.role !== Roles.courtReporter) {
                return history.push(`/deposition/pre/${depositionID}`);
            }

            if (!shouldSendToPreDepo && !userStatus.participant?.isAdmitted) {
                return history.push(`/deposition/pre/${depositionID}/waiting`);
            }

            const { permissions } = await getDepositionPermissions();
            const transcriptions = await getTranscriptions();
            const breakrooms = await getBreakrooms();
            const events = await getDepositionEvents(depositionID);

            if (isSharing) {
                fetchExhibitFileInfo(depositionID);
            }
            const tracks = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } });
            tracks.push(dataTrack);
            const room = await connect(token, {
                ...TWILIO_VIDEO_CONFIG,
                name: depositionID,
                tracks,
            });

            dispatch(actions.addUserTracks(tracks));
            setDepoRoom(room);

            if (!isMounted.current) {
                return disconnectFromDepo(room, dispatch);
            }
            dispatch(actions.setToken(token));
            dispatch(actions.joinToRoom(room));
            dispatch(actions.setParticipantsData(participants));
            dispatch(actions.setIsRecording(isOnTheRecord));
            dispatch(actions.setPermissions(permissions));
            dispatch(actions.setBreakrooms(breakrooms || []));
            dispatch(actions.setTranscriptions({ transcriptions: transcriptions || [], events: events || [] }));
            dispatch(actions.setTimeZone(timeZone));
            dispatch(actions.addDataTrack(dataTrack));

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
