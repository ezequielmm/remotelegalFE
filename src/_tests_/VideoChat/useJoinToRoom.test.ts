import { act, renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import state from "../mocks/state";
import { useJoinToRoom } from "../../hooks/VideoChat/roomHooks";
import actions from "../../state/videoChat/videoChatAction";

jest.mock("../../helpers/generateToken", () => ({
    __esModule: true, // this property makes it work
    default: () => ({ token: "1234" }),
}));
jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { test: "1234" };
    },

    createLocalTracks: async () => [],

    connect: async () => "room",
}));

test("It calls dispatch with proper actions", async () => {
    const { result } = renderHook(() => useJoinToRoom(), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await joinToRoom();
        expect(state.dispatch).toHaveBeenCalledWith(
            actions.addDataTrack({
                test: "1234",
            })
        );

        expect(state.dispatch).toHaveBeenLastCalledWith(actions.joinToRoom("room"));
    });
});
