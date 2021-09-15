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
    link.setAttribute("download", fileName || fileUrl.split("/").pop().split("?")[0]);
    link.setAttribute("target", "_blank");
    setTimeout(() => {
        link.click();
        document.body.removeChild(link);
    }, 500);
};
export default downloadFile;
