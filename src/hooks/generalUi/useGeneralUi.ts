import { useContext } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/GeneralUi/GeneralUiActions";

// TODO: Message for the future: See if this hook is necessary.

export const useToggleSider = () => {
    const { dispatch } = useContext(GlobalStateContext);
    const toggleSider = () => dispatch(actions.changeSiderStatus());
    return { toggleSider };
};

export default useToggleSider;
