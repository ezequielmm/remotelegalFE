import { useContext } from "react";
import { useParams } from "react-router";
import { DepositionInfo } from "../../constants/techInfo";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useGetDepositionInfo = () => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, () => Promise<DepositionInfo>>(async () => {
        const response = await deps.apiService.getDepositionInfo(depositionID);
        return response;
    }, []);
};
export default useGetDepositionInfo;
