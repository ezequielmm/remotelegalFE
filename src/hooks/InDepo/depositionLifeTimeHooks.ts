import { useContext, useEffect, useRef } from "react";
import { connect, createLocalTracks, LocalDataTrack } from "twilio-video";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import configParticipantListeners from "../../helpers/configParticipantListeners";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/InDepo/InDepoActions";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import { DepositionID } from "../../state/types";

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
    return useAsyncCallback(async (payload: string) => {
        const response = await deps.apiService.joinDeposition(payload);
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

    return useAsyncCallback(async (depositionID: string) => {
        const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
        const { token, witnessEmail }: any = await generateToken(depositionID);
        const room = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } }).then(
            (localTracks) => {
                return connect(token, { name: depositionID, tracks: [...localTracks, dataTrack] });
            }
        );
        if (!isMounted.current) {
            return disconnectFromDepo(room, dispatch);
        }
        dispatch(actions.addWitness(witnessEmail));
        dispatch(actions.addDataTrack(dataTrack));
        dispatch(actions.joinToRoom(room));
        return configParticipantListeners(room, dispatch);
    }, []);
};
