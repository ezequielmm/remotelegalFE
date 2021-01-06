import { useContext } from "react";
import { useParams } from "react-router";
import { IDepositionPermissions } from "../../models/deposition";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useDepositionPermissions = () => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, () => Promise<IDepositionPermissions>>(async () => {
        const response = await deps.apiService.getDepositionPermissions(depositionID);
        return response;
    }, []);
};
export default useDepositionPermissions;
