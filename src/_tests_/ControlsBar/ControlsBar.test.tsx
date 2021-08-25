import { act, fireEvent, waitFor, waitForDomChange, screen } from "@testing-library/react";
import Amplify from "aws-amplify";
import { LocalParticipant } from "twilio-video/tsdef/LocalParticipant";
import Client from "@twilio/conversations";
import userEvent from "@testing-library/user-event";
import ControlsBar from "../../components/ControlsBar";
import { getBreakrooms } from "../mocks/breakroom";
import * as CONSTANTS from "../../constants/inDepo";
import * as TEST_CONSTANTS from "../constants/InDepo";
import { HELP_TITLE } from "../../constants/help";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import * as AUTH from "../mocks/Auth";
import { AMPLIFY_CONFIG } from "../constants/login";
import getLeaveModalTextContent from "../../components/ControlsBar/helpers/getLeaveModalTextContent";
import { wait } from "../../helpers/wait";
import { MESSAGE } from "../mocks/messages";
import { rootReducer } from "../../state/GlobalState";
import { TimeZones } from "../../models/general";

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

let handleOnSendMessage;

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

Amplify.configure({
    Auth: AMPLIFY_CONFIG,
});

let mockHistoryPush;

let props;
const breakrooms = getBreakrooms();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

beforeEach(() => {
    window.MediaStream = (jest.fn() as any).mockImplementation(() => {});
    Object.defineProperty(global.navigator, "mediaDevices", {
        writable: true,
        value: {
            getUserMedia: jest.fn().mockResolvedValue([]),
            enumerateDevices: jest.fn().mockResolvedValue([]),
        },
    });
    Client.create = jest.fn().mockResolvedValue({
        getConversationByUniqueName: jest.fn().mockResolvedValue({
            sendMessage: jest.fn(),
            getMessages: jest.fn().mockResolvedValue({
                items: [],
            }),
        }),
        on: (action, cb) => {
            handleOnSendMessage = cb;
        },
        off: jest.fn(),
    });
    mockHistoryPush = jest.fn();

    props = {
        breakrooms,
        isRecording: false,
        togglerRecording: jest.fn(),
        togglerExhibits: jest.fn(),
        togglerRealTime: jest.fn(),
        handleJoinBreakroom: jest.fn(),
        localParticipant: getParticipant("test1"),
        exhibitsOpen: false,
        realTimeOpen: false,
        canRecord: false,
        canEnd: false,
        settings: { EnableBreakrooms: "enabled", EnableRealTimeTab: "enabled", EnableLiveTranscriptions: "enabled" },
    };
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

test("Exhibits is opened when exhibits Open is true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />);
    expect(await findByTestId("exhibits")).toBeInTheDocument();
});

test("Real Time is opened when realTimeOpen is true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} realTimeOpen />);
    expect(await findByTestId("realtime")).toBeInTheDocument();
});

test("Both exhibits and real time are opened when both conditions are true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen realTimeOpen />);
    expect(await findByTestId("exhibits")).toBeInTheDocument();
    expect(await findByTestId("realtime")).toBeInTheDocument();
});

test("Muted icon is toggled when clicking the mute button", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(await findByTestId("audio"));
    expect(await findByTestId("muted")).toBeInTheDocument();
    fireEvent.click(await findByTestId("audio"));
    expect(await findByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Audio icon is toggled to unmuted when the initialAudioEnabled is true", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen initialAudioEnabled />
    );
    expect(await findByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Audio icon is toggled to muted when the initialAudioEnabled is false", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen initialAudioEnabled={false} />
    );
    expect(await findByTestId("muted")).toBeInTheDocument();
    expect(queryByTestId("unmuted")).toBeFalsy();
});

test("Camera icon is toggled when clicking the camera button", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(await findByTestId("camera"));
    expect(await findByTestId("camerahidden")).toBeInTheDocument();
    fireEvent.click(await findByTestId("camera"));
    expect(await findByTestId("camerashown")).toBeInTheDocument();
    expect(queryByTestId("camerahidden")).toBeFalsy();
});

test("End depo button doesn´t show if prop is false", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    expect(queryByTestId("end")).toBeFalsy();
});

test("Record button doesn´t show if prop is false", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    expect(queryByTestId("record")).toBeFalsy();
});

test("End depo button shows if prop is true", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} canEnd />);
    expect(queryByTestId("end")).toBeTruthy();
});

test("Record button shows if prop is true", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} canRecord />);
    expect(queryByTestId("record")).toBeTruthy();
});

test("Show modal when click on JOIN Breakroom if is recording", () => {
    const { queryByTestId, queryAllByTestId, queryByText } = renderWithGlobalContext(
        <ControlsBar {...props} isRecording />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    fireEvent.click(queryAllByTestId("join_breakroom")[0]);
    expect(queryByText(CONSTANTS.BREAKROOM_ON_THE_RECORD_MESSAGE)).toBeTruthy();
});

test("Trigger handleJoinBreakroom when click on JOIN Breakroom if is not recording", () => {
    const { queryByTestId, queryAllByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    fireEvent.click(queryByTestId("breakrooms"));
    fireEvent.click(queryAllByTestId("join_breakroom")[0]);
    expect(props.handleJoinBreakroom).toBeCalledWith(breakrooms[0].id);
});

test("Should call setParticipantStatus endpoint with muted in true by default", async () => {
    localStorage.clear();
    const initialState = {
        ...rootReducer,
        initialState: {
            depositionsList: {
                sorting: "",
                pageNumber: 0,
                filter: undefined,
            } as any,
            user: { ...rootReducer.initialState.user },
            postDepo: { ...rootReducer.initialState.postDepo },
            signalR: { ...rootReducer.initialState.signalR },
            generalUi: { ...rootReducer.initialState.generalUi },
            room: {
                ...rootReducer.initialState.room,
                newSpeaker: null,
                publishedAudioTrackStatus: null,
            },
        },
    };
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />, customDeps, initialState);
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).toHaveBeenCalledWith({ isMuted: true });
});

test("Should call setParticipantStatus endpoint with muted in false when it is already muted", async () => {
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />, customDeps);
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).toHaveBeenCalledWith({ isMuted: false });
});
test("Shows correct modal text if registered participant is not a witness and redirects to proper route", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(false, false);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Attorney")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith("/depositions");
});

test("Shows correct modal text if non-registered participant is not a witness and redirects to proper route", async () => {
    AUTH.NOT_VALID();
    const modalText = getLeaveModalTextContent(false, false);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Attorney")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith(TEST_CONSTANTS.NON_WITNESS_NON_REGISTERED_EXPECTED_REDIRECT_BODY);
});
test("Shows correct modal text if participant is a non-registered witness and redirects to proper route", async () => {
    AUTH.NOT_VALID();
    const modalText = getLeaveModalTextContent(false, true);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith(TEST_CONSTANTS.WITNESS_EXPECTED_REDIRECT_BODY);
});
test("Shows correct modal text if participant is registered and witness and redirects to proper route", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(false, true);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith("/depositions");
});

test("Shows correct modal text if participant is a witness and the depo is recording and doesn´t redirect", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(true, true);
    const { getByText, getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} isRecording />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(queryByTestId("confirm_nagative_button")).toBeFalsy();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).not.toHaveBeenCalled();
});

test("Shows a locked breakroom item when a breakroom is locked", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeInTheDocument();
});

test("Shows a locked breakroom item when a breakroom is locked", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeInTheDocument();
});

test("Shows a locked breakroom item when a breakroom is locked and show disabled if canJoinToLockedBreakroom is false", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeDisabled();
});

test("Shows a locked breakroom item when a breakroom is locked and show disabled if canJoinToLockedBreakroom is true", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
            canJoinToLockedBreakroom
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).not.toBeDisabled();
});

test("After clicks on the support button a modal should open", async () => {
    AUTH.VALID();
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            canJoinToLockedBreakroom
        />
    );

    expect(queryByText(HELP_TITLE)).not.toBeInTheDocument();
    fireEvent.click(queryByTestId("more_dropdown").children[0].firstChild);
    expect(queryByTestId("support_button")).toBeInTheDocument();
    fireEvent.click(queryByTestId("support_button"));
    await waitForDomChange();
    expect(queryByText(HELP_TITLE)).toBeInTheDocument();
});

test("After clicks on the support button, a modal should open and not display the jobNumber if it doesn't have", async () => {
    AUTH.VALID();
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            canJoinToLockedBreakroom
        />
    );

    fireEvent.click(queryByTestId("more_dropdown").children[0].firstChild);
    fireEvent.click(queryByTestId("support_button"));
    await waitForDomChange();
    expect(queryByTestId("job_number")).not.toBeInTheDocument();
});

test("After clicks on the support button a modal should open and also display the jobNumber", async () => {
    AUTH.VALID();
    const jobNumber = "JobNumber";
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            canJoinToLockedBreakroom
            jobNumber={jobNumber}
        />
    );

    fireEvent.click(queryByTestId("more_dropdown").children[0].firstChild);
    fireEvent.click(queryByTestId("support_button"));
    await waitForDomChange();
    expect(queryByText(jobNumber)).toBeInTheDocument();
});

test("Show popup and close by time", async () => {
    const { queryByTestId, container, findByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} disableChat={false} />,
        undefined,
        customReducer
    );

    await act(async () => {
        await waitFor(() => {
            handleOnSendMessage(MESSAGE);
        });
    });

    expect(await findByTestId(CONSTANTS.POPOVER_NEW_MESSAGE)).toBeInTheDocument();

    setTimeout(() => {
        expect(container.getElementsByClassName("ant-popover-hidden").length).toBe(1);
    }, 4000);
});

test("Show popup and close by close button", async () => {
    const { container, findByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} disableChat={false} />,
        undefined,
        customReducer
    );

    await act(async () => {
        await waitFor(() => {
            handleOnSendMessage(MESSAGE);
        });
    });

    expect(await findByTestId(CONSTANTS.POPOVER_NEW_MESSAGE)).toBeInTheDocument();

    setTimeout(async () => {
        fireEvent.click(await findByTestId("close-button"));
        expect(container.getElementsByClassName("ant-popover-hidden").length).toBe(1);
    }, 2000);
});

test("Should display Settings modal", async () => {
    AUTH.VALID();
    renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            canJoinToLockedBreakroom
        />
    );
    await waitFor(() => screen.getByTestId("more_dropdown"));

    await act(async () => {
        fireEvent.click(screen.getByTestId("more_dropdown").children[0].firstChild);
    });
    userEvent.click(screen.getByTestId("settings_button"));
    await waitFor(() => {
        expect(screen.getByTestId("setting_in_depo")).toBeInTheDocument();
    });
});

it("Should hide buttons depending on settings", async () => {
    const settings = { EnableBreakrooms: "disabled", RealTime: "disabled" };
    renderWithGlobalContext(<ControlsBar {...props} settings={settings} />);

    expect(screen.queryByTestId("breakrooms")).toBeNull();
    expect(screen.queryByTestId("realtime")).not.toBeInTheDocument();
});
