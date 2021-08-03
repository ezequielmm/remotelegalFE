import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useSendParticipantDevices = () => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback(async (devices) => {
        const response = await deps.apiService.sendParticipantDevices(depositionID, devices);
        return response;
    }, []);
};
export default useSendParticipantDevices;
