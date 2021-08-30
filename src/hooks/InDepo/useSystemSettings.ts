import { useContext } from "react";
import { SystemSettings } from "../../models/systemsettings";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

// eslint-disable-next-line import/prefer-default-export
export const useSystemSetting = () => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, () => Promise<SystemSettings>>(async () => {
        const response = await deps.apiService.getSystemSettings();
        return response;
    }, []);
};
