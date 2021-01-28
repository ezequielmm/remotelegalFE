import { useContext } from "react";
import { EventModel } from "../../models";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

const useGetEvents = () => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, (depositionID: string) => Promise<EventModel.IEvent[]>>(
        async (depositionID: string) => {
            const response = await deps.apiService.getDepositionEvents(depositionID);
            return response;
        },
        []
    );
};
export default useGetEvents;
