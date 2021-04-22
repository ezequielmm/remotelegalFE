import { useContext } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export interface IFrontEndContent {
    url: string;
    isPublic: boolean;
    name: string;
}

// eslint-disable-next-line import/prefer-default-export
export const useFrontEndContent = (): {
    getFrontEndContent: () => void;
    frontEndContent: IFrontEndContent[];
    pendingGetFrontEndContent: boolean;
    errorGetFrontEndContent: any;
} => {
    const { deps } = useContext(GlobalStateContext);

    const [getFrontEndContent, pendingGetFrontEndContent, errorGetFrontEndContent, frontEndContent] = useAsyncCallback(
        async () => deps.apiService.frontEndContent(),
        []
    );

    return {
        getFrontEndContent,
        frontEndContent,
        pendingGetFrontEndContent,
        errorGetFrontEndContent,
    };
};
