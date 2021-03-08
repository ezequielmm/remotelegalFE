import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import Message from "../components/Message";
import { EXHIBIT_DELETE_ERROR_MESSAGE } from "../constants/exhibits";
import { GlobalStateContext } from "../state/GlobalState";
import { DepositionID } from "../state/types";
import useAsyncCallback from "./useAsyncCallback";

export const useDeleteExhibit = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    const [deleteExhibit, pendingDelete, errorDelete] = useAsyncCallback(
        async (documentId: string) => deps.apiService.deleteExhibit({ depositionID, documentId }),
        []
    );

    useEffect(() => {
        if (errorDelete) {
            Message({
                content: EXHIBIT_DELETE_ERROR_MESSAGE,
                type: "error",
                duration: 3,
            });
        }
    }, [errorDelete]);
    return { deleteExhibit, pendingDelete, errorDelete };
};
