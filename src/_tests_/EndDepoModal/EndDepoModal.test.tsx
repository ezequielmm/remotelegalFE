import React from "react";
import { fireEvent } from "@testing-library/react";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import EndDepoModal from "../../components/ControlsBar/components/EndDepoModal";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

test("EndDepoModal shows when visible prop is true", () => {
    const { getByText } = renderWithGlobalContext(
        <EndDepoModal visible closeModal={jest.fn()} endDepoFunc={jest.fn()} />
    );
    expect(getByText(TESTS_CONSTANTS.END_DEPO_MODAL_FIRST_TEXT)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.END_DEPO_MODAL_SECOND_TEXT)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.CANCEL_BUTTON)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.CONFIRMATION_BUTTON)).toBeInTheDocument();
});

test("EndDepoModal doesn´t show when visible prop is false", () => {
    const { queryByText } = renderWithGlobalContext(
        <EndDepoModal visible={false} closeModal={jest.fn()} endDepoFunc={jest.fn()} />
    );
    expect(queryByText(TESTS_CONSTANTS.END_DEPO_MODAL_FIRST_TEXT)).toBeFalsy();
    expect(queryByText(TESTS_CONSTANTS.END_DEPO_MODAL_SECOND_TEXT)).toBeFalsy();
    expect(queryByText(TESTS_CONSTANTS.CANCEL_BUTTON)).toBeFalsy();
    expect(queryByText(TESTS_CONSTANTS.CONFIRMATION_BUTTON)).toBeFalsy();
});

test("Close Modal function is called when cancel button is pressed", () => {
    const closeModalFunc = jest.fn();
    const { getByText } = renderWithGlobalContext(
        <EndDepoModal visible closeModal={closeModalFunc} endDepoFunc={jest.fn()} />
    );
    fireEvent.click(getByText(TESTS_CONSTANTS.CANCEL_BUTTON));
    expect(closeModalFunc).toHaveBeenCalled();
});

test("End Depo function is called when confirmation button is pressed", () => {
    const endDepoFunc = jest.fn();
    const { getByText } = renderWithGlobalContext(
        <EndDepoModal visible closeModal={jest.fn()} endDepoFunc={endDepoFunc} />
    );
    fireEvent.click(getByText(TESTS_CONSTANTS.CONFIRMATION_BUTTON));
    expect(endDepoFunc).toHaveBeenCalled();
});
