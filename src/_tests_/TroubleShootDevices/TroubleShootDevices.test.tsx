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
import TroubleShootDevicesModal from "../../routes/TroubleShootUserDevices/components/TroubleShootDevicesModal";
import { rootReducer } from "../../state/GlobalState";
import getParticipant from "../mocks/participant";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";
import createDevices from "../../routes/TroubleShootUserDevices/helpers/createDevices";

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
let audioTrackMock;
let videoTrackMock;
let mockVideoTracks;
let mockAudioTracks;
const publishTrackMock = jest.fn();

jest.mock("twilio-video", () => ({
    ...(jest.requireActual("twilio-video") as any),
    createLocalVideoTrack: (args) => mockVideoTracks(args),
    createLocalAudioTrack: (args) => mockAudioTracks(args),
}));
beforeEach(() => {
    audioTrackMock = jest.fn();
    videoTrackMock = jest.fn();
    mockVideoTracks = jest.fn().mockResolvedValue(audioTrackMock);
    mockAudioTracks = jest.fn().mockResolvedValue(videoTrackMock);
    Object.defineProperty(window, "location", {
        writable: true,
        value: { reload: jest.fn() },
    });
    customDeps = getMockDeps();
    customDeps.apiService.notifyParticipantPresence = jest.fn().mockResolvedValue({});
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
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[1].label));
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
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label));
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
        const device = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[3].label));
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
        speakersForBE: {
            name: TEST_CONSTANTS.DEVICES_LIST_MOCK[2].label,
        },
        videoForBE: {
            status: MODULE_CONSTANTS.DevicesStatus.enabled,
            name: TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label,
        },
        microphoneForBE: {
            name: TEST_CONSTANTS.DEVICES_LIST_MOCK[0].label,
        },
        ...TEST_CONSTANTS.GET_AUDIO_EXPECTED_MOCK({
            label: TEST_CONSTANTS.DEVICES_LIST_MOCK[0].label,
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[0].deviceId },
        }),
        ...TEST_CONSTANTS.GET_VIDEO_EXPECTED_MOCK({
            label: TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label,
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[4].deviceId },
        }),
        speakers: TEST_CONSTANTS.DEVICES_LIST_MOCK[2].deviceId,
    };
    await waitFor(() => {
        expect(customDeps.apiService.notifyParticipantPresence).toHaveBeenCalledWith({ isMuted: false, depositionID });
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(LOCALSTORAGE_OBJECT);
        expect(screen.getByText("IN DEPO")).toBeInTheDocument();
    });
});
test("Alert is shown when notifyParticipantPresence fetch fails", async () => {
    customDeps.apiService.notifyParticipantPresence = jest.fn().mockRejectedValue({});
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    userEvent.click(screen.getByText(MODULE_CONSTANTS.JOIN_BUTTON_LABEL));
    await waitFor(() => {
        expect(screen.getByText(MODULE_CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });
});
test("it calls notifyParticipantPresence with the right params and sets the devices in localStorage with false if none are available", async () => {
    enumerateDevicesMock.mockResolvedValue(TEST_CONSTANTS.NON_AVAILABLE_DEVICES_LIST_MOCK);
    getUserMediaMock.mockRejectedValue({ name: "NotAllowedError" });
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => expect(screen.queryByTestId("overlay")).toBeFalsy());
    userEvent.click(screen.getByText(MODULE_CONSTANTS.JOIN_BUTTON_LABEL));
    const LOCALSTORAGE_OBJECT = {
        microphoneForBE: {
            name: "",
        },
        speakersForBE: {
            name: "Default Speakers",
        },
        videoForBE: {
            name: "",
            status: MODULE_CONSTANTS.DevicesStatus.blocked,
        },
        video: false,
        audio: false,
        speakers: false,
    };
    await waitFor(() => {
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(LOCALSTORAGE_OBJECT);
    });
});

test("it shows proper text when In Depo and no buttons", async () => {
    renderWithGlobalContext(<TroubleShootDevicesModal visible isDepo />, customDeps);
    await waitFor(() => {
        expect(screen.getByText(MODULE_CONSTANTS.IN_DEPO_TITLE)).toBeInTheDocument();
        expect(screen.queryByTestId(`audio_on_toggle_false`)).toBeFalsy();
        expect(screen.queryByTestId(`audio_on_toggle_true`)).toBeFalsy();
        expect(screen.queryByTestId(`video_on_toggle_false`)).toBeFalsy();
        expect(screen.queryByTestId(`video_on_toggle_true`)).toBeFalsy();
    });
});

test("it changes devices", async () => {
    const onClose = jest.fn();
    localStorage.setItem(
        "selectedDevices",
        JSON.stringify({
            audio: false,
            video: false,
            speakers: false,
        })
    );
    const expectedLocalStorageItem = JSON.stringify(
        createDevices(
            { video: false, audio: false },
            {
                videoinput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].kind as "videoinput",
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label,
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].deviceId,
                },
                audioinput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].kind as "audioinput",
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].deviceId,
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].label,
                },
                audiooutput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].kind as "audiooutput",
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId,
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].label,
                },
            }
        )
    );
    const participant = getParticipant();
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
                mockDepoRoom: {
                    localParticipant: {
                        videoTracks: participant.videoTracks,
                        audioTracks: participant.audioTracks,
                    },
                } as any,
            },
        },
    };
    renderWithGlobalContext(<TroubleShootDevicesModal onClose={onClose} visible isDepo />, customDeps, initialState);
    await waitFor(() => screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label));
    await act(async () => {
        userEvent.click(screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label)[0]);
        const videoDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label));
        userEvent.click(videoDevice);
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[0].label));
        const audioDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[1].label));
        userEvent.click(audioDevice);
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[2].label));
        const speakerDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[3].label));
        userEvent.click(speakerDevice);
    });
    fireEvent.click(screen.getByText(MODULE_CONSTANTS.CHANGE_DEVICES_LABEL));
    await waitFor(() => {
        expect(trackpubsToTracks(participant.videoTracks)[0].restart).toHaveBeenCalledWith({
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].deviceId },
        });
        expect(trackpubsToTracks(participant.audioTracks)[0].restart).toHaveBeenCalledWith({
            deviceId: { exact: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].deviceId },
        });
        expect(localStorage.getItem("selectedDevices")).toEqual(expectedLocalStorageItem);
        expect(onClose).toHaveBeenCalled();
    });
});
test("it calls change speakers if old speakers were selected", async () => {
    localStorage.setItem("selectedDevices", JSON.stringify({ speakers: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId }));
    renderWithGlobalContext(<TroubleShootUserDevices />, customDeps);
    await waitFor(() => {
        expect(changeSpeakers).toHaveBeenCalledWith(
            screen.getByTestId("audio_file"),
            TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId
        );
    });
});
test("it publishes new tracks", async () => {
    const onClose = jest.fn();
    localStorage.setItem(
        "selectedDevices",
        JSON.stringify({
            audio: false,
            video: false,
            speakers: false,
        })
    );
    const expectedLocalStorageItem = JSON.stringify(
        createDevices(
            { video: false, audio: false },
            {
                videoinput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].kind as "videoinput",
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label,
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[5].deviceId,
                },
                audioinput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].kind as "audioinput",
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].deviceId,
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[1].label,
                },
                audiooutput: {
                    kind: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].kind as "audiooutput",
                    value: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].deviceId,
                    label: TEST_CONSTANTS.DEVICES_LIST_MOCK[3].label,
                },
            }
        )
    );
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
                mockDepoRoom: {
                    localParticipant: {
                        publishTrack: publishTrackMock,
                        videoTracks: new Map().set("item1", []),
                        audioTracks: new Map().set("item2", []),
                    },
                } as any,
            },
        },
    };
    renderWithGlobalContext(<TroubleShootDevicesModal onClose={onClose} visible isDepo />, customDeps, initialState);
    await waitFor(() => screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label));
    await act(async () => {
        userEvent.click(screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label)[0]);
        const videoDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label));
        userEvent.click(videoDevice);
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[0].label));
        const audioDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[1].label));
        userEvent.click(audioDevice);
        userEvent.click(screen.getByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[2].label));
        const speakerDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[3].label));
        userEvent.click(speakerDevice);
    });
    fireEvent.click(screen.getByText(MODULE_CONSTANTS.CHANGE_DEVICES_LABEL));
    await waitFor(() => {
        expect(mockAudioTracks).toHaveBeenCalledWith(TEST_CONSTANTS.EXPECTED_CREATE_AUDIO_TRACK_MOCK_ARGS);
        expect(mockVideoTracks).toHaveBeenCalledWith(TEST_CONSTANTS.EXPECTED_CREATE_VIDEO_TRACK_MOCK_ARGS);
        expect(publishTrackMock).toHaveBeenCalledWith(audioTrackMock);
        expect(publishTrackMock).toHaveBeenCalledWith(videoTrackMock);
        expect(localStorage.getItem("selectedDevices")).toEqual(expectedLocalStorageItem);
        expect(onClose).toHaveBeenCalled();
    });
});

test("Should show toast if depo room is reconnecting", async () => {
    const onClose = jest.fn();
    localStorage.setItem(
        "selectedDevices",
        JSON.stringify({
            audio: false,
            video: false,
            speakers: false,
        })
    );

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
                depoRoomReconnecting: true,
                mockDepoRoom: {
                    localParticipant: {
                        publishTrack: publishTrackMock,
                        videoTracks: new Map().set("item1", []),
                        audioTracks: new Map().set("item2", []),
                    },
                } as any,
            },
        },
    };
    renderWithGlobalContext(<TroubleShootDevicesModal onClose={onClose} visible isDepo />, customDeps, initialState);
    await waitFor(() => screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label));
    await act(async () => {
        userEvent.click(screen.getAllByText(TEST_CONSTANTS.DEVICES_LIST_MOCK[4].label)[0]);
        const videoDevice = await waitFor(() => screen.getByTestId(TEST_CONSTANTS.DEVICES_LIST_MOCK[5].label));
        userEvent.click(videoDevice);
    });
    fireEvent.click(screen.getByText(MODULE_CONSTANTS.CHANGE_DEVICES_LABEL));
    await waitFor(() => {
        expect(screen.getByText(MODULE_CONSTANTS.NOT_CONNECTED_TO_DEPO)).toBeInTheDocument();
    });
});
