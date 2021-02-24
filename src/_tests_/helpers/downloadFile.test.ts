import downloadFile from "../../helpers/downloadFile";

describe("downloadFile", () => {
    test("should download the file", () => {
        const link = {
            ...document.createElement("a"),
            href: "",
            click: jest.fn(),
            setAttribute: jest.fn(),
        };
        const appendChild = jest.fn();
        const removeChild = jest.fn();
        jest.spyOn(document, "createElement").mockImplementation(() => link);
        jest.spyOn(document.body, "appendChild").mockImplementation(appendChild);
        jest.spyOn(document.body, "removeChild").mockImplementation(removeChild);
        downloadFile("www.test.com");
        expect(appendChild).toHaveBeenCalledWith(link);
        expect(link.href).toEqual("www.test.com");
        expect(link.setAttribute).toHaveBeenCalledWith("download", "download");
        expect(link.setAttribute).toHaveBeenCalledWith("target", "_blank");
        expect(link.click).toHaveBeenCalledTimes(1);
        expect(removeChild).toHaveBeenCalledWith(link);
    });
});
