import { waitFor } from "@testing-library/react";
import downloadFile from "../../helpers/downloadFile";

test("should download the file", async () => {
    const url = "test.pdf";
    const link = {
        ...document.createElement("a"),
        href: url,
        click: jest.fn(),
        setAttribute: jest.fn(),
    };
    jest.spyOn(window, "fetch").mockImplementation(() => {
        const response = { blob: () => Promise.resolve({}) };
        return Promise.resolve(response);
    });
    const appendChild = jest.fn();
    const removeChild = jest.fn();
    const fetchURL = jest.fn().mockResolvedValue({ blob: jest.fn().mockResolvedValue({}) });
    jest.spyOn(window, "fetch").mockImplementation(fetchURL);
    global.URL.createObjectURL = jest.fn(() => url);
    jest.spyOn(document, "createElement").mockImplementation(() => link);
    jest.spyOn(document.body, "appendChild").mockImplementation(appendChild);
    jest.spyOn(document.body, "removeChild").mockImplementation(removeChild);
    downloadFile(url, "Test");
    expect(link.href).toEqual(url);
    await waitFor(() => expect(link.setAttribute).toHaveBeenCalledWith("download", "Test"));
    await waitFor(() => expect(link.setAttribute).toHaveBeenCalledWith("target", "_blank"));
    await waitFor(() => expect(link.click).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(removeChild).toHaveBeenCalledWith(link));
});
