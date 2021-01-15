import { act, renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import state from "../mocks/state";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import actions from "../../state/InDepo/InDepoActions";

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
    useParams: () => ({ depositionID: "test1234" }),
}));

test("It calls dispatch with proper actions", async () => {
    const { result } = renderHook(() => useJoinDeposition(), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await joinToRoom();
        expect(state.dispatch).toHaveBeenCalledWith(
            actions.addDataTrack({
                test: "1234",
            })
        );

        expect(state.dispatch).toHaveBeenCalledWith(actions.joinToRoom("room"));
    });
});
