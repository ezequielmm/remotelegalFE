const downloadFile = async (fileUrl: string, onError?: () => void) => {
    try {
        const blob = await fetch(fileUrl).then((r) => r.blob());
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        document.body.appendChild(link);
        link.setAttribute("download", fileUrl.split("/").pop().split("?")[0]);
        link.setAttribute("target", "_blank");
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
        }, 500);
    } catch (e) {
        console.error("downloadFile error:", e);
        if (onError) return onError();
    }
};
export default downloadFile;
