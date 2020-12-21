import { Auth } from "aws-amplify";

const UploadService = async (
    path: string,
    fileName: string,
    onUploadProgress: (ev: ProgressEvent) => void,
    onComplete: () => void,
    onError: () => void
) => {
    const formData = new FormData();
    formData.append("file", fileName);

    const request = new XMLHttpRequest();
    request.open("POST", `${process.env.REACT_APP_BASE_BE_URL}${path}`);

    const session = await Auth.currentSession();
    const jwt = session.getIdToken().getJwtToken();
    
    request.setRequestHeader("Authorization", `Bearer ${jwt}`);
    request.upload.addEventListener("progress", onUploadProgress);
    request.addEventListener("load", () => {
        const statusFirstDigit = request.status.toString()[0];
        if (statusFirstDigit === "2") {
            return onComplete();
        }
        if (statusFirstDigit === "4" || statusFirstDigit === "5") {
            return onError();
        }
    });
    request.send(formData);
};

export default UploadService;
