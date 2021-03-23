import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

const useSendParticipantStatus = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    return useAsyncCallback(
        async (muted) => await deps.apiService.setParticipantStatus({ depositionID, isMuted: muted }),
        []
    );
};

export default useSendParticipantStatus;
