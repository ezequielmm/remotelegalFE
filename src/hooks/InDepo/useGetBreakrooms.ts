import { useContext } from "react";
import { useParams } from "react-router";
import { BreakroomModel } from "../../models";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useGetBreakrooms = () => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, () => Promise<BreakroomModel.Breakroom[]>>(async () => {
        const response = await deps.apiService.getDepositionBreakrooms(depositionID);
        return response;
    }, []);
};
export default useGetBreakrooms;
