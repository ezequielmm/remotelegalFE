import { Deps, HTTP_METHOD } from "../models/general";

export const uploadFile = async (
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
        request.open(HTTP_METHOD.POST, `${process.env.REACT_APP_BASE_BE_URL}${path}`);

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

export const uploadFileToS3 = async (
    url: string,
    file: File,
    onUploadProgress: (ev: ProgressEvent) => void,
    onComplete: () => void,
    onError: (Error?: string[]) => void,
    method: HTTP_METHOD,
    headers: object
) => {
    try {
        const request = new XMLHttpRequest();
        request.open(method, url);

        Object.keys(headers).forEach((key) => {
            request.setRequestHeader(key, headers[key]);
        });
        request.upload.addEventListener("progress", onUploadProgress);
        request.addEventListener("load", () => {
            if (request.status === 200) {
                return onComplete();
            }
            try {
                const errorResponses = JSON.parse(request.response);
                const errors = errorResponses.map((error) => error.message);
                return onError(errors);
            } catch (error) {
                return onError();
            }
        });

        const reader = new FileReader();
        reader.onload = (evt) => {
            request.send(evt.target.result);
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        onError([error]);
    }
};
