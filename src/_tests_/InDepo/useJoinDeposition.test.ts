import { act, renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import state from "../mocks/state";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import actions from "../../state/InDepo/InDepoActions";
import * as AUTH from "../mocks/Auth";
import { wait } from "../../helpers/wait";
import configParticipantListeners from "../../helpers/configParticipantListeners";

jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { test: "1234" };
    },

    createLocalTracks: async () => [],

    connect: async () => "room",
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useLocation: () => {},
    useParams: () => ({ depositionID: "test1234" }),
}));

jest.mock("../../helpers/configParticipantListeners", () => ({
    __esModule: true,
    default: jest.fn(),
}));

test("It calls dispatch with proper actions", async () => {
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(), { wrapper });
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
    const playStub = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(null);
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(playStub).not.toHaveBeenCalled();
        playStub.mockRestore();
    });
});

test("It calls audio play function when a participant is added", async () => {
    configParticipantListeners.mockImplementation((room, callback) => callback());
    const playStub = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockResolvedValue(null);
    AUTH.VALID();
    const { result } = renderHook(() => useJoinDeposition(), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await wait(200);
        await joinToRoom();
        expect(playStub).toHaveBeenCalled();
        playStub.mockRestore();
    });
});
