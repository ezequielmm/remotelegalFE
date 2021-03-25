import { useContext } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

const useJoinResponse = (onSuccess, onError) => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback(
        async (depositionID: string, participantID: string, admit: boolean) => {
            try {
                const response = await deps.apiService.joinResponse(depositionID, participantID, admit);
                onSuccess();
                return response;
            } catch (e) {
                onError();
            }
        },
        [onSuccess, onError]
    );
};
export default useJoinResponse;
