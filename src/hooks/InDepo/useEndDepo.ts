import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useKillDepo } from "./depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";

const useEndDepo = () => {
    const [endDepo, setEndDepo] = useState(false);
    const { state, dispatch } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;
    const [killDepo] = useKillDepo();
    const history = useHistory();
    const { depositionID } = useParams<{ depositionID: string }>();

    useEffect(() => {
        if (endDepo) {
            dataTrack.send(JSON.stringify({ module: "endDepo", value: "" }));
            // This somewhat ensures that the disconnect function runs after the dataTrack message has been sent. Should be replaced in the near future.
            setTimeout(() => disconnectFromDepo(currentRoom, dispatch, history, killDepo, depositionID), 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDepo]);

    return { setEndDepo };
};
export default useEndDepo;
