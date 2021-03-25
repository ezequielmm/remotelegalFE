import { useContext } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

const useWaitingRoomParticipants = () => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback(async (depositionID: string) => {
        const response = await deps.apiService.waitingRoomParticipants(depositionID);
        return response;
    }, []);
};
export default useWaitingRoomParticipants;
