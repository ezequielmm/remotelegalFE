import { renderHook } from "@testing-library/react-hooks";
import useUserTracks from "../../hooks/userTracks/useUserTracks";

const getUserMedia = jest.fn().mockResolvedValue(true);

beforeEach(() => {
    (global.navigator as any).mediaDevices = {
        getUserMedia,
    };
});

test("Should call all getUserMedia when you use loadStreams methods", async () => {
    const { result, waitFor } = renderHook(() => useUserTracks(true));
    result.current.loadUserStreams(null, null);
    await waitFor(() => {
        expect(getUserMedia).toHaveBeenCalled();
    });
});
