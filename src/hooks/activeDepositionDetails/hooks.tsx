import React from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

const useFetchCaption = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (depositionID: string) => {
        const caption = await deps.apiService.fetchCaption(depositionID);
        return caption;
    }, []);
};
export default useFetchCaption;
