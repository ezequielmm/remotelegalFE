import { useContext, useEffect, useRef } from "react";
import { connect, createLocalTracks, LocalDataTrack } from "twilio-video";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import configParticipantListeners from "../../helpers/configParticipantListeners";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/InDepo/InDepoActions";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import useDepositionPermissions from "./useDepositionPermissions";
import { DepositionID } from "../../state/types";
import useGetTranscriptions from "./useGetTranscriptions";

export const useKillDepo = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async () => {
        const response = await deps.apiService.endDeposition(depositionID);
        return response;
    }, [depositionID]);
};

const useGenerateToken = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async () => {
        const response = await deps.apiService.joinDeposition(depositionID);
        return response;
    }, []);
};

export const useJoinDeposition = () => {
    const { dispatch } = useContext(GlobalStateContext);
    const [generateToken] = useGenerateToken();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);
    const [getDepositionPermissions] = useDepositionPermissions();
    const [getTranscriptions] = useGetTranscriptions();

    return useAsyncCallback(async (depositionID: string) => {
        const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
        const { permissions } = await getDepositionPermissions();
        const transcriptions = await getTranscriptions();
        const { isOnTheRecord, timeZone, token, witnessEmail }: any = await generateToken();
        const room = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } }).then(
            (localTracks) => {
                return connect(token, { name: depositionID, tracks: [...localTracks, dataTrack] });
            }
        );

        if (!isMounted.current) {
            return disconnectFromDepo(room, dispatch);
        }
        dispatch(actions.joinToRoom(room));
        dispatch(actions.setIsRecoding(isOnTheRecord));
        dispatch(actions.setPermissions(permissions));
        dispatch(actions.addWitness(witnessEmail));
        dispatch(actions.setTranscriptions(transcriptions || []));
        dispatch(actions.setTimeZone(timeZone));
        dispatch(actions.addDataTrack(dataTrack));
        return configParticipantListeners(room, dispatch);
    }, []);
};
