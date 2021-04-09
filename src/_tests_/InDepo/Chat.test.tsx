import { fireEvent } from "@testing-library/react";
import React from "react";
import { LocalParticipant } from "twilio-video";
import * as CONSTANTS from "../../constants/inDepo";
import { Message, TimeZones } from "../../models/general";
import Chat from "../../routes/InDepo/Chat";
import { rootReducer } from "../../state/GlobalState";
import { MESSAGE, MESSAGE_CURRENT_USER } from "../mocks/messages";
import getParticipant from "../mocks/participant";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

const customReducer = {
    ...rootReducer,
    initialState: {
        ...rootReducer.initialState,
        room: {
            ...rootReducer.initialState.room,
            currentRoom: {
                ...rootReducer.initialState.room.currentRoom,
                localParticipant: getParticipant("test1", "ROLE", "fcastello@makingsense.com") as LocalParticipant,
            },
            token: "some-token",
            timeZone: TimeZones.ET,
        },
    },
};
const sendMessage = jest.fn();
const loadClient = jest.fn();
const props = {
    closePopOver: jest.fn(),
    open: true,
    messages: [],
    sendMessage,
    loadClient,
    loadingClient: false,
    errorLoadingClient: false,
};

it("display no messages", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} />, getMockDeps(), customReducer);
    const messages = queryByTestId(CONSTANTS.CHAT_MESSAGE_TEST_ID);
    expect(messages).not.toBeInTheDocument();
});

it("display one messages", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} messages={[MESSAGE as Message]} />,
        getMockDeps(),
        customReducer
    );
    const messages = queryByTestId(CONSTANTS.CHAT_MESSAGE_TEST_ID);
    expect(messages).toBeInTheDocument();
});

it("display one message as external user", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} messages={[MESSAGE as Message]} />,
        getMockDeps(),
        customReducer
    );
    const messages = queryByTestId(CONSTANTS.CHAT_MESSAGE_TEST_ID);
    expect(messages).toBeInTheDocument();
});

it("display one message as current user", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} messages={[MESSAGE_CURRENT_USER as Message]} />,
        getMockDeps(),
        customReducer
    );
    const messages = queryByTestId(CONSTANTS.CURRENT_USER_CHAT_MESSAGE_TEST_ID);
    expect(messages).toBeInTheDocument();
});

it("display spinner when loadingClient", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} loadingClient />, getMockDeps(), customReducer);
    const spinner = queryByTestId("spinner");
    expect(spinner).toBeInTheDocument();
});

it("display error when errorLoadingClient", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} errorLoadingClient />,
        getMockDeps(),
        customReducer
    );
    const errorLoadingClient = queryByTestId(CONSTANTS.CHAT_ERROR_TEST_ID);
    expect(errorLoadingClient).toBeInTheDocument();
});

it("triggers loadClient when click on try again", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} errorLoadingClient />,
        getMockDeps(),
        customReducer
    );
    const tryAgainButton = queryByTestId(CONSTANTS.CHAT_TRY_AGAIN_TEST_ID);
    fireEvent.click(tryAgainButton);
    expect(loadClient).toHaveBeenCalled();
});

it("have input disabled when loadingClient", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} loadingClient />, getMockDeps(), customReducer);
    const input = queryByTestId(CONSTANTS.CHAT_INPUT_TEST_ID);
    expect(input).toBeDisabled();
});

it("have input disabled when errorLoadingClient", async () => {
    const { queryByTestId } = renderWithGlobalContext(
        <Chat {...props} errorLoadingClient />,
        getMockDeps(),
        customReducer
    );
    const input = queryByTestId(CONSTANTS.CHAT_INPUT_TEST_ID);
    expect(input).toBeDisabled();
});

it("have input enabled when errorLoadingClient and loadingClient are false", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} />, getMockDeps(), customReducer);
    const input = queryByTestId(CONSTANTS.CHAT_INPUT_TEST_ID);
    expect(input).toBeEnabled();
});

it("have input button disabled when text empty", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} />, getMockDeps(), customReducer);
    const inputButton = queryByTestId(CONSTANTS.CHAT_INPUT_BUTTON_TEST_ID);
    expect(inputButton).toBeDisabled();
});

it("have input button enabled when text not empty", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} />, getMockDeps(), customReducer);
    const input = queryByTestId(CONSTANTS.CHAT_INPUT_TEST_ID);
    fireEvent.change(input, { target: { value: "any text" } });
    const inputButton = queryByTestId(CONSTANTS.CHAT_INPUT_BUTTON_TEST_ID);
    expect(inputButton).toBeEnabled();
});

it("should call sendMessage when inputButton is clicked", async () => {
    const { queryByTestId } = renderWithGlobalContext(<Chat {...props} />, getMockDeps(), customReducer);
    const input = queryByTestId(CONSTANTS.CHAT_INPUT_TEST_ID);
    fireEvent.change(input, { target: { value: "any text" } });
    const inputButton = queryByTestId(CONSTANTS.CHAT_INPUT_BUTTON_TEST_ID);
    fireEvent.click(inputButton);
    expect(sendMessage).toHaveBeenCalledWith("any text");
});
