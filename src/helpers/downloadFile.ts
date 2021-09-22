export enum DownloadStatus {
    "pending",
    "completed",
    "error",
}

export type DownloadStatusType = keyof typeof DownloadStatus;

const downloadFile = async (
    fileUrl: string,
    fileName?: string,
    onDownloadStatus?: (status: DownloadStatusType) => void
) => {
    let url = fileUrl;
    if (onDownloadStatus) onDownloadStatus("pending");
    const params = new URLSearchParams(url);
    const queryParamFilename = params.get("response-content-disposition");
    const queryParamsFilenameString = queryParamFilename?.substring(queryParamFilename.indexOf("=") + 1);
    try {
        const blob = await fetch(fileUrl).then((r) => r.blob());
        url = window.URL.createObjectURL(new Blob([blob]));
    } catch (e) {
        if (onDownloadStatus) onDownloadStatus("error");
        console.error("downloadFile error:", e);
    }
    if (onDownloadStatus) onDownloadStatus("completed");
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.setAttribute("target", "_blank");
    link.setAttribute("download", fileName || queryParamsFilenameString || fileUrl.split("/").pop().split("?")[0]);
    setTimeout(() => {
        link.click();
        document.body.removeChild(link);
    }, 500);
};
export default downloadFile;
