import { fireEvent } from "@testing-library/react";
import React from "react";

import CopyLink from "../../components/ControlsBar/components/CopyLink";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

let props;

beforeEach(() => {
    props = {
        closePopOver: jest.fn(),
        link: "link-to-depo",
    };
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

test("Hidden textarea should be populated with the link prop", async () => {
    const { findByTestId } = renderWithGlobalContext(<CopyLink {...props} />);
    const textarea = await findByTestId("hidden-textarea");
    expect(textarea.value).toEqual("link-to-depo");
});

test("Alerts should not appear until the copy button is clicked", async () => {
    const { queryByTestId } = renderWithGlobalContext(<CopyLink {...props} />);

    expect(queryByTestId("copy-link-success-alert")).toBeFalsy();
    expect(queryByTestId("copy-link-error-alert")).toBeFalsy();
});

test("Document.execCommand should be called when the copy link button is clicked", async () => {
    document.execCommand = jest.fn();
    const { findByTestId } = renderWithGlobalContext(<CopyLink {...props} />);
    fireEvent.click(await findByTestId("copy-button"));
    expect(document.execCommand).toHaveBeenCalledWith("copy");
});

test("Error alert should appear if the copy fails", async () => {
    document.execCommand = null;
    const { findByTestId, queryByTestId } = renderWithGlobalContext(<CopyLink {...props} />);
    fireEvent.click(await findByTestId("copy-button"));
    expect(queryByTestId("copy-link-error-alert")).toBeTruthy();
    expect(queryByTestId("copy-link-success-alert")).toBeFalsy();
});

test("Success alert should appear if the copy succeeds", async () => {
    document.execCommand = jest.fn();
    const { findByTestId, queryByTestId } = renderWithGlobalContext(<CopyLink {...props} />);
    fireEvent.click(await findByTestId("copy-button"));
    expect(queryByTestId("copy-link-error-alert")).toBeFalsy();
    expect(queryByTestId("copy-link-success-alert")).toBeTruthy();
});
