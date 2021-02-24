const downloadFile = (fileUrl: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    document.body.appendChild(link);
    link.setAttribute("download", "download");
    link.setAttribute("target", "_blank");
    link.click();
    document.body.removeChild(link);
};
export default downloadFile;
