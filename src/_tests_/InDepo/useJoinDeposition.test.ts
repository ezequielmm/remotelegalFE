import { act, renderHook } from "@testing-library/react-hooks";
import useSound from "use-sound";
import wrapper from "../mocks/wrapper";
import state from "../mocks/state";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import actions from "../../state/InDepo/InDepoActions";
import * as AUTH from "../mocks/Auth";
import { wait } from "../../helpers/wait";
import configParticipantListeners from "../../helpers/configParticipantListeners";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { getEvents, getTranscription } from "../mocks/transcription";

let setTranscriptions;

jest.mock("twilio-video", () => ({
    ...(jest.requireActual("twilio-video") as any),
    LocalDataTrack: function dataTrack() {
        return { test: "1234" };
    },

    createLocalTracks: async () => [],

    connect: async () => "room",
}));

beforeEach(() => {
    setTranscriptions = jest.fn();
});

jest.mock("react-router", () => ({
    ...(jest.requireActual("react-router") as any),
    useLocation: () => {},
    useParams: () => ({ depositionID: "test1234" }),
}));

jest.mock("use-sound", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../helpers/configParticipantListeners", () => ({
    __esModule: true,
    default: jest.fn(),
}));

test("It calls dispatch with proper actions", async () => {
    AUTH.VALID();
    const playMock = jest.fn();
    const useSoundMock = useSound as jest.Mock;
    useSoundMock.mockImplementation(() => [playMock]);
    const { result } = renderHook(() => useJoinDeposition(jest.fn()), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(state.dispatch).toHaveBeenCalledWith(
            actions.addDataTrack({
                test: "1234",
            })
        );

        expect(state.dispatch).toHaveBeenCalledWith(actions.joinToRoom("room"));
    });
});

test("It does not call audio play function if no participant were added", async () => {
    configParticipantListeners.mockImplementation((room, callback) => {});
    const playMock = jest.fn();
    useSound.mockImplementation((sound) => [playMock]);
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(jest.fn()), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(playMock).not.toHaveBeenCalled();
    });
});

test("It calls audio play function when a participant is added", async () => {
    configParticipantListeners.mockImplementation((room, callback) => callback());
    const playMock = jest.fn();
    const useSoundMock = useSound as jest.Mock;
    useSoundMock.mockImplementation(() => [playMock]);
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(jest.fn()), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(playMock).toHaveBeenCalled();
    });
});

test("It calls setTranscriptions with the transcriptions", async () => {
    const expectedTranscriptions = setTranscriptionMessages([getTranscription()], getEvents() as any);
    configParticipantListeners.mockImplementation((room, callback) => callback());
    const playMock = jest.fn();
    const useSoundMock = useSound as jest.Mock;
    useSoundMock.mockImplementation(() => [playMock]);
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(setTranscriptions), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(playMock).toHaveBeenCalled();
        expect(setTranscriptions).toHaveBeenCalledWith(expectedTranscriptions);
    });
});
