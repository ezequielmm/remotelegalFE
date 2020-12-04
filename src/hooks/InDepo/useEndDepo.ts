import { useContext, useEffect, useState } from "react";
import { useKillDepo } from "./depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";

const useEndDepo = () => {
    const [endDepo, setEndDepo] = useState(false);
    const { state, dispatch } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;
    const [killDepo] = useKillDepo();

    useEffect(() => {
        if (endDepo) {
            dataTrack.send(JSON.stringify({ module: "endDepo", value: "" }));
            disconnectFromDepo(currentRoom, dispatch, killDepo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDepo]);

    return { setEndDepo };
};
export default useEndDepo;
