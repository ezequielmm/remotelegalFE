import { useContext, useEffect, useRef, useState } from "react";
import { connect, createLocalTracks, LocalDataTrack, Room } from "twilio-video";
import { useParams } from "react-router";
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

export const useKillDepo = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async () => {
        const response = await deps.apiService.endDeposition(depositionID);
        return response;
    }, [depositionID]);
};

const useGenerateDepositionToken = () => {
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
    const [generateBreakroomToken] = useGenerateBreakroomToken();
    const [getBreakrooms] = useGetBreakrooms();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            if (breakroom) return disconnectFromDepo(breakroom, dispatch);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [breakroom]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useAsyncCallback(async (breakroomID: string) => {
        const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
        const token: any = await generateBreakroomToken();
        const room = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } }).then(
            (localTracks) => {
                return connect(token, { name: breakroomID, tracks: [...localTracks, dataTrack] });
            }
        );
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
            (callbackRoom) => dispatch(actions.addRemoteParticipantBreakroom(callbackRoom)),
            (callbackRoom) => dispatch(actions.removeRemoteParticipantBreakroom(callbackRoom))
        );
    }, []);
};

export const useJoinDeposition = () => {
    const [depoRoom, setDepoRoom] = useState<Room>(undefined);
    const { dispatch } = useContext(GlobalStateContext);
    const [generateToken] = useGenerateDepositionToken();
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            if (depoRoom) return disconnectFromDepo(depoRoom, dispatch);
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

    return useAsyncCallback(async (depositionID: string) => {
        const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
        const { permissions } = await getDepositionPermissions();
        const transcriptions = await getTranscriptions();
        const breakrooms = await getBreakrooms();
        const events = await getDepositionEvents(depositionID);
        const { isOnTheRecord, timeZone, token, isSharing }: any = await generateToken();
        if (isSharing) {
            fetchExhibitFileInfo(depositionID);
        }
        const room = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } }).then(
            (localTracks) => {
                return connect(token, { name: depositionID, tracks: [...localTracks, dataTrack] });
            }
        );
        setDepoRoom(room);

        if (!isMounted.current) {
            return disconnectFromDepo(room, dispatch);
        }
        dispatch(actions.joinToRoom(room));
        dispatch(actions.setIsRecording(isOnTheRecord));
        dispatch(actions.setPermissions(permissions));
        dispatch(actions.setBreakrooms(breakrooms || []));
        dispatch(actions.setTranscriptions({ transcriptions: transcriptions || [], events: events || [] }));
        dispatch(actions.setTimeZone(timeZone));
        dispatch(actions.addDataTrack(dataTrack));
        return configParticipantListeners(
            room,
            (callbackRoom) => dispatch(actions.addRemoteParticipant(callbackRoom)),
            (callbackRoom) => dispatch(actions.removeRemoteParticipant(callbackRoom))
        );
    }, []);
};
