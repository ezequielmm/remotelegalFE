import { useCallback, useContext } from "react";
import uploadFile from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useUploadFile = (depositionID: string) => {
    const upload = useCallback(
        async ({ onSuccess, onError, file, onProgress }) => {
            uploadFile(
                `/api/Depositions/${depositionID}/exhibits`,
                file,
                (event) => onProgress({ percent: (event.loaded / event.total) * 100 }),
                onSuccess,
                onError
            );
        },
        [depositionID]
    );

    return { upload };
};

export const useFileList = (depositionID: string) => {
    const { deps } = useContext(GlobalStateContext);

    return useAsyncCallback(async () => {
        const depositionCreated = await deps.apiService.fetchDepositionsFiles({ depositionID });
        return depositionCreated;
    }, []);
};
