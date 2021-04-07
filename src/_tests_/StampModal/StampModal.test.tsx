import React from "react";
import { fireEvent, waitForDomChange } from "@testing-library/react";
import StampModal from "../../components/PDFTronViewer/components/StampModal";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/stampModal";
import { TimeZones } from "../../models/general";

test("Modal shows when open prop is true", () => {
    const { queryByText, queryByPlaceholderText } = renderWithGlobalContext(
        <StampModal timeZone={TimeZones.ET} open handleClose={jest.fn} onConfirm={jest.fn} />
    );
    expect(queryByText(CONSTANTS.BUTTON_LABEL)).toBeTruthy();
    expect(queryByPlaceholderText(CONSTANTS.INPUT_PLACEHOLDER)).toBeTruthy();
    expect(queryByText(CONSTANTS.MODAL_TITLE)).toBeTruthy();
});

test("Modal doesn´t show if open prop is false", () => {
    const { queryByText, queryByPlaceholderText } = renderWithGlobalContext(
        <StampModal timeZone={TimeZones.ET} open={false} handleClose={jest.fn} onConfirm={jest.fn} />
    );
    expect(queryByText(CONSTANTS.BUTTON_LABEL)).toBeFalsy();
    expect(queryByPlaceholderText(CONSTANTS.INPUT_PLACEHOLDER)).toBeFalsy();
    expect(queryByText(CONSTANTS.MODAL_TITLE)).toBeFalsy();
});

test("Expect button to be disabled if there´s no value in input", () => {
    const { getByTestId, getByPlaceholderText } = renderWithGlobalContext(
        <StampModal timeZone={TimeZones.ET} open handleClose={jest.fn} onConfirm={jest.fn} />
    );
    fireEvent.change(getByPlaceholderText(CONSTANTS.INPUT_PLACEHOLDER), { target: { value: "" } });
    expect(getByTestId(CONSTANTS.BUTTON_TESTID)).toBeDisabled();
});

test("Confirm function gets called with the proper params", async () => {
    const onConfirmMock = jest.fn();
    const { getByPlaceholderText, getByTestId } = renderWithGlobalContext(
        <StampModal timeZone={TimeZones.ET} open handleClose={jest.fn} onConfirm={onConfirmMock} />
    );
    fireEvent.change(getByPlaceholderText(CONSTANTS.INPUT_PLACEHOLDER), { target: { value: "test1234" } });
    fireEvent.click(getByTestId(CONSTANTS.BUTTON_TESTID));
    await waitForDomChange();
    expect(onConfirmMock).toHaveBeenCalled();
});
