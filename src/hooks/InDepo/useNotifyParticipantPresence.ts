import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useNotifyParticipantPresence = () => {
    const { deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    return useAsyncCallback(async (isMuted) => {
        const participantPresence = await deps.apiService.notifyParticipantPresence({ depositionID, isMuted });
        dispatch(actions.setIsMuted(participantPresence?.value?.isMuted));
        return participantPresence;
    }, []);
};
export default useNotifyParticipantPresence;
