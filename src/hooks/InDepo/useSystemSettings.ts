import { useContext, useEffect } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

// eslint-disable-next-line import/prefer-default-export
export const useSystemSetting = () => {
    const { deps } = useContext(GlobalStateContext);
    const [getSettings, loading, error, settings] = useAsyncCallback(async () => {
        return deps.apiService.getSystemSettings();
    }, []);
    useEffect(() => {
        getSettings();
    }, [getSettings]);
    return {
        loading,
        settings,
        error,
    };
};
