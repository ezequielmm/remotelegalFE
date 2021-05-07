import { useEffect, useState } from "react";
import { useKillDepo } from "./depositionLifeTimeHooks";
import * as CONSTANTS from "../../constants/inDepo";
import Message from "../../components/Message";

const useEndDepo = () => {
    const [endDepo, setEndDepo] = useState(false);
    const [killDepo, loading, error] = useKillDepo();

    useEffect(() => {
        if (error) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
            setEndDepo(false);
        }
    }, [error]);

    useEffect(() => {
        if (endDepo) {
            killDepo();
        }
    }, [endDepo, killDepo]);

    return { setEndDepo, loading, error };
};
export default useEndDepo;
