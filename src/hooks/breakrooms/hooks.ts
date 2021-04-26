import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useToggleLockRoom = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID, breakroomID } = useParams<{ depositionID: string; breakroomID: string }>();
    return useAsyncCallback(async (isLock) => {
        return await deps.apiService.lockRoom({ depositionID, breakroomID, isLock });
    }, []);
};
