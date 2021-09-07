import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useGetDepoSummaryInfo = () => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback(async () => {
        const response = await deps.apiService.getDepoSummaryInfo(depositionID);
        return response;
    }, []);
};
export default useGetDepoSummaryInfo;
