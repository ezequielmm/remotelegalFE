import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../state/GlobalState";
import useAsyncCallback from "./useAsyncCallback";

export const useDepositionAttendees = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    return useAsyncCallback((payload) => deps.apiService.getDepositionAttendees({ depositionID, ...payload }), []);
};

export default useDepositionAttendees;
