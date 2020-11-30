import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../../state/GlobalState";

const useEndDepo = (disconnect) => {
    const [endDepo, setEndDepo] = useState(false);
    const { state, dispatch } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;

    useEffect(() => {
        if (endDepo) {
            dataTrack.send(JSON.stringify({ module: "endDepo", value: "" }));
            disconnect(currentRoom, dispatch, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDepo]);

    return { setEndDepo };
};
export default useEndDepo;
