const downloadFile = async (fileUrl: string, fileName?: string) => {
    let url = fileUrl;
    const params = new URLSearchParams(url);
    const queryParamFilename = params.get("response-content-disposition");
    const queryParamsFilenameString = queryParamFilename?.substring(queryParamFilename.indexOf("=") + 1);
    try {
        const blob = await fetch(fileUrl).then((r) => r.blob());
        url = window.URL.createObjectURL(new Blob([blob]));
    } catch (e) {
        console.error("downloadFile error:", e);
    }
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);

    link.setAttribute("target", "_blank");
    link.setAttribute("download", fileName || queryParamsFilenameString);
    setTimeout(() => {
        link.click();
        document.body.removeChild(link);
    }, 500);
};
export default downloadFile;
