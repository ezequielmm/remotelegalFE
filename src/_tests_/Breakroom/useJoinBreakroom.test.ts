import { act, renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import state from "../mocks/state";
import { useJoinBreakroom } from "../../hooks/InDepo/depositionLifeTimeHooks";
import actions from "../../state/InDepo/InDepoActions";
import { JOIN_DEPOSITION_MOCK } from "../constants/InDepo";

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
    useParams: () => ({ depositionID: "test1234", breakroomID: "testBreakroom1234" }),
}));

test("It calls dispatch with proper actions", async () => {
    const { result } = renderHook(() => useJoinBreakroom(), { wrapper });
    const [joinToRoom] = result.current;

    await act(async () => {
        await joinToRoom();
        expect(state.dispatch).toHaveBeenCalledWith(actions.addBreakroomDataTrack({ test: "1234" }));
        expect(state.dispatch).toHaveBeenCalledWith(actions.joinToBreakroom("room"));
    });
});
