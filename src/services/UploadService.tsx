import { Deps } from "../models/general";

const UploadService = async (
    path: string,
    fileName: string,
    onUploadProgress: (ev: ProgressEvent) => void,
    onComplete: () => void,
    onError: (Error?: string[]) => void,
    deps?: Deps
) => {
    try {
        const formData = new FormData();
        formData.append("file", fileName);

        const request = new XMLHttpRequest();
        request.open("POST", `${process.env.REACT_APP_BASE_BE_URL}${path}`);

        const jwt = await deps?.apiService?.getTokenSet();

        request.setRequestHeader("Authorization", `Bearer ${jwt}`);
        request.upload.addEventListener("progress", onUploadProgress);
        request.addEventListener("load", () => {
            const statusFirstDigit = request.status.toString()[0];
            if (statusFirstDigit === "2") {
                return onComplete();
            }
            if (statusFirstDigit === "4" || statusFirstDigit === "5") {
                try {
                    const errorResponses = JSON.parse(request.response);
                    const errors = errorResponses.map((error) => error.message);
                    return onError(errors);
                } catch (error) {
                    onError();
                }
            }
        });
        request.send(formData);
    } catch (error) {
        onError([error]);
    }
};

export default UploadService;
