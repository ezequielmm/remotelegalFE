import { useCallback, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import Message from "../../components/Message";
import { IUser } from "../../models/user";
import { GlobalStateContext } from "../../state/GlobalState";
import { END_DEPO_DOWNLOAD_ERROR_TITLE } from "../../_tests_/constants/postDepo";
import useAsyncCallback from "../useAsyncCallback";

export const useEndDepoCurrentUser = (): { userInfo: IUser; loadingUserInfo: boolean; errorUserInfo: boolean } => {
    const { deps } = useContext(GlobalStateContext);
    const [fetchUserInfo, loadingUserInfo, errorUserInfo, userInfo] = useAsyncCallback(async () => {
        const user: IUser = await deps.apiService.currentUser();
        return user;
    }, []);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    return {
        userInfo,
        loadingUserInfo,
        errorUserInfo,
    };
};

export const useEndDepoDownloadAssets = (depositionId: string = ""): { downloadAssets: (user: IUser) => void } => {
    const history = useHistory();
    const downloadAssets = useCallback(
        (user: IUser) => {
            if (!depositionId) {
                Message({
                    content: END_DEPO_DOWNLOAD_ERROR_TITLE,
                    type: "error",
                    duration: 3,
                });
            } else {
                if (user?.isGuest) {
                    history.push("/sign-up", { email: user.emailAddress });
                } else {
                    history.push(`/deposition/post-depo-details/${depositionId}`);
                }
            }
        },
        [history, depositionId]
    );

    return {
        downloadAssets,
    };
};
