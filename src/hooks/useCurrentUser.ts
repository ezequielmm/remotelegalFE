import { useContext } from "react";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/User/UserActions";
import useAsyncCallback from "./useAsyncCallback";

const useCurrentUser = () => {
    const { deps, dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async () => {
        const user = await deps.apiService.currentUser();
        dispatch(actions.setCurrentUser(user));
    }, []);
};

export default useCurrentUser;
