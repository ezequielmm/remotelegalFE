import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Switch } from "react-router";
import { createMemoryHistory } from "history";
import TroubleShootUserDevices from "../../routes/TroubleShootUserDevices";
import * as TEST_CONSTANTS from "../constants/troubleShootDevices";
import getMockDeps from "../utils/getMockDeps";
import changeSpeakers from "../../helpers/changeSpeakers";
import * as MODULE_CONSTANTS from "../../constants/TroubleShootUserDevices";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

const mockVolumeMeter = jest.fn();

const history = createMemoryHistory();

jest.mock("../../helpers/changeSpeakers", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../hooks/useVolumeMeter", () => ({
    __esModule: true,
    default: (args) => mockVolumeMeter(args),
}));

let customDeps;
const getUserMediaMock = jest.fn();
const enumerateDevicesMock = jest.fn();

const playAudioStub = jest.spyOn(window.HTMLAudioElement.prototype, "play").mockImplementation(() => null);

const InDepo = () => <div>IN DEPO</div>;

beforeEach(() => {
    customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    mockVolumeMeter.mockReturnValue({ volumeLevel: 10 });
    getUserMediaMock.mockResolvedValue(TEST_CONSTANTS.STREAM_MOCK);
    enumerateDevicesMock.mockResolvedValue(TEST_CONSTANTS.DEVICES_LIST_MOCK);
    Object.defineProperty(global.navigator, "mediaDevices", {
        writable: true,
        value: {
            getUserMedia: (args) => getUserMediaMock(args),
            enumerateDevices: (args) => enumerateDevicesMock(args),
        },
    });
});

test("overlay is shown on startup, getUserMedia  is called with the right params", async () => {
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    expect(getUserMediaMock).toHaveBeenCalledWith(TEST_CONSTANTS.GET_VIDEO_EXPECTED_MOCK());
    expect(getUserMediaMock).toHaveBeenCalledWith(TEST_CONSTANTS.GET_AUDIO_EXPECTED_MOCK());
});
test("Blocked message is shown if camera if blocked", async () => {
    getUserMediaMock.mockRejectedValue({ name: "NotAllowedError" });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(screen.getByTestId("video_on_toggle_false")).toBeInTheDocument();
        expect(screen.getByTestId("audio_on_toggle_true")).toBeInTheDocument();
        expect(screen.getByText(MODULE_CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.title)).toBeInTheDocument();
        expect(screen.getByText(MODULE_CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.subtitle)).toBeInTheDocument();
    });
});
test("Unavailable message is shown if camera fails for anything else", async () => {
    getUserMediaMock.mockRejectedValue({ name: "" });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(screen.getByTestId("video_on_toggle_false")).toBeInTheDocument();
        expect(screen.getByTestId("audio_on_toggle_true")).toBeInTheDocument();
        expect(screen.getByText(MODULE_CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.title)).toBeInTheDocument();
        expect(screen.getByText(MODULE_CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.subtitle)).toBeInTheDocument();
    });
});
test(" - is shown if no devices are detected", async () => {
    enumerateDevicesMock.mockResolvedValue(TEST_CONSTANTS.NON_AVAILABLE_DEVICES_LIST_MOCK);
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(screen.getAllByText("-")).toHaveLength(3);
    });
});
test("Default Speakers is shown if no audio output devices are detected", async () => {
    enumerateDevicesMock.mockResolvedValue(
        TEST_CONSTANTS.NON_AVAILABLE_DEVICES_LIST_MOCK.filter((device) => device.kind !== "audiooutput")
    );
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(screen.getByText("Default Speakers")).toBeInTheDocument();
    });
});
test("useVolumeMeter is called with the right params", async () => {
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(mockVolumeMeter).toHaveBeenCalledWith(TEST_CONSTANTS.STREAM_MOCK);
    });
});
test("Muted and unmuted can be toggled", async () => {
    const audioMock = {
        getTracks: jest.fn().mockReturnValue([
            {
                enabled: true,
                kind: "audio",
                stop: jest.fn(),
            },
        ]),
    };
    getUserMediaMock.mockImplementation((audio) => {
        if (audio.audio) {
            return audioMock;
        }
        throw Error("");
    });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);

    await waitFor(() => {
        expect(screen.getByTestId("audio_on_toggle_false")).toBeInTheDocument();
        expect(screen.getByTestId("microphone_meter_10")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("audio_on_toggle_false"));
        expect(screen.getByTestId("audio_on_toggle_true")).toBeInTheDocument();
        expect(audioMock.getTracks).toHaveBeenCalled();
        expect(audioMock.getTracks()[0].enabled).toBeFalsy();
    });
    expect(screen.getByTestId("microphone_meter_0")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("audio_on_toggle_true"));
    await waitFor(() => {
        expect(audioMock.getTracks).toHaveBeenCalled();
        expect(audioMock.getTracks()[0].enabled).toBeTruthy();
    });
});

test("Camera on and off can be toggled", async () => {
    const videoMock = {
        getTracks: jest.fn().mockReturnValue([
            {
                enabled: true,
                kind: "video",
                stop: jest.fn(),
            },
        ]),
    };
    getUserMediaMock.mockImplementation((video) => {
        if (video.video) {
            return videoMock;
        }
        throw Error("");
    });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);

    await waitFor(() => {
        expect(screen.getByTestId("video_on_toggle_true")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("video_on_toggle_true"));
        expect(screen.getByTestId("video_on_toggle_false")).toBeInTheDocument();
        expect(videoMock.getTracks).toHaveBeenCalled();
        expect(videoMock.getTracks()[0].enabled).toBeFalsy();
    });
    fireEvent.click(screen.getByTestId("video_on_toggle_false"));
    await waitFor(() => {
        expect(videoMock.getTracks).toHaveBeenCalled();
        expect(videoMock.getTracks()[0].enabled).toBeTruthy();
    });
});

test("Calls audio play function to test speakers", async () => {
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(screen.getByText(MODULE_CONSTANTS.SPEAKER_TEST_LABEL)).toBeInTheDocument();
        fireEvent.click(screen.getByText(MODULE_CONSTANTS.SPEAKER_TEST_LABEL));
        expect(playAudioStub).toHaveBeenCalled();
    });
});

test("it changes audio input", async () => {
    const audioMock = {
        getTracks: jest.fn().mockReturnValue([
            {
                enabled: true,
                kind: "audio",
                stop: jest.fn(),
            },
        ]),
    };
    const additionalBody = {
        deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].deviceId },
    };
    getUserMediaMock.mockImplementation((audio) => {
        if (audio.audio) {
            return audioMock;
        }
        throw Error("");
    });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    await act(async () => {
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[0].label));
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[1].deviceId));
        userEvent.click(device);
    });
    expect(audioMock.getTracks()[0].stop).toHaveBeenCalled();
    expect(getUserMediaMock).toHaveBeenCalledWith(TEST_CONSTANTS.GET_AUDIO_EXPECTED_MOCK(additionalBody));
});

test("it changes video input", async () => {
    const videoMock = {
        getTracks: jest.fn().mockReturnValue([
            {
                enabled: true,
                kind: "video",
                stop: jest.fn(),
            },
        ]),
    };
    const additionalBody = {
        deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].deviceId },
    };
    getUserMediaMock.mockImplementation((video) => {
        if (video.video) {
            return videoMock;
        }
        throw Error("");
    });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    await act(async () => {
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label));
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[5].deviceId));
        userEvent.click(device);
    });
    expect(videoMock.getTracks()[0].stop).toHaveBeenCalled();
    expect(getUserMediaMock).toHaveBeenCalledWith(TEST_CONSTANTS.GET_VIDEO_EXPECTED_MOCK(additionalBody));
});
test("it calls change speakers with the proper params", async () => {
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    await act(async () => {
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[2].label));
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId));
        userEvent.click(device);
    });
    await waitFor(() => {
        expect(changeSpeakers).toHaveBeenCalledWith(
            screen.getByTestId("audio_file"),
            TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId
        );
    });
});
test("it calls setParticipantStatus with the right params and sets the devices in localStorage", async () => {
    const depositionID = "test1234";
    renderWithGlobalContext(
        <Switch>
            <Route exact path="/:depositionID" component={TroubleShootUserDevices} />
            <Route exact path="/deposition/join/:depositionID" component={InDepo} />
        </Switch>,
        customDeps,
        undefined,
        history
    );
    history.push(`/${depositionID}`);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    userEvent.click(screen.getByText(MODULE_CONSTANTS.JOIN_BUTTON_LABEL));
    const LOCALSTORAGE_OBJECT = {
        ...TEST_CONSTANTS.GET_AUDIO_EXPECTED_MOCK({
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[0].deviceId },
        }),
        ...TEST_CONSTANTS.GET_VIDEO_EXPECTED_MOCK({
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[4].deviceId },
        }),
        speakers: TEST_CONSTANTS.DEVICES_LIST_MOCK[2].deviceId,
    };
    await waitFor(() => {
        expect(customDeps.apiService.setParticipantStatus).toHaveBeenCalledWith({ isMuted: false, depositionID });
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(LOCALSTORAGE_OBJECT);
        expect(screen.getByText("IN DEPO")).toBeInTheDocument();
    });
});
test("Alert is shown when setParticipantStatus fetch fails", async () => {
    customDeps.apiService.setParticipantStatus = jest.fn().mockRejectedValue({});
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    userEvent.click(screen.getByText(MODULE_CONSTANTS.JOIN_BUTTON_LABEL));
    await waitFor(() => {
        expect(screen.getByText(MODULE_CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });
});
test("it calls setParticipantStatus with the right params and sets the devices in localStorage with false if none are available", async () => {
    enumerateDevicesMock.mockResolvedValue(TEST_CONSTANTS.NON_AVAILABLE_DEVICES_LIST_MOCK);
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    userEvent.click(screen.getByText(MODULE_CONSTANTS.JOIN_BUTTON_LABEL));
    const LOCALSTORAGE_OBJECT = {
        video: false,
        audio: false,
        speakers: false,
    };
    await waitFor(() => {
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(LOCALSTORAGE_OBJECT);
    });
});
