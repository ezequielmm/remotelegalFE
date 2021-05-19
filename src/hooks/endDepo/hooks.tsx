import { useCallback } from "react";
import { useHistory } from "react-router";
import Message from "../../components/Message";
import { IUser } from "../../models/user";
import { END_DEPO_DOWNLOAD_ERROR_TITLE } from "../../_tests_/constants/postDepo";

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
