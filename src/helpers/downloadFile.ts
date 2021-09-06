const downloadFile = async (fileUrl: string, fileName?: string) => {
    let url = fileUrl;
    try {
        const blob = await fetch(fileUrl).then((r) => r.blob());
        url = window.URL.createObjectURL(new Blob([blob]));
    } catch (e) {
        console.error("downloadFile error:", e);
    }
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
