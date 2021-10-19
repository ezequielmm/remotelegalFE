import { renderHook } from "@testing-library/react-hooks";
import useUserTracks from "../../hooks/userTracks/useUserTracks";

const getUserMedia = jest.fn().mockResolvedValue(true);
const enumerateDevices = jest.fn().mockResolvedValue([]);

beforeEach(() => {
    (global.navigator as any).mediaDevices = {
        getUserMedia,
        enumerateDevices,
    };
});

test("Should call all getUserMedia when you use loadStreams methods", async () => {
    const { result, waitFor } = renderHook(() => useUserTracks(true));
    await result.current.loadUserStreams(null, null);
    await waitFor(() => {
        expect(getUserMedia).toHaveBeenCalled();
    });
});
