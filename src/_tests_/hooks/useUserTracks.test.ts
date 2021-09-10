import { renderHook } from "@testing-library/react-hooks";
import useUserTracks from "../../hooks/useUserTracks";

const getUserMedia = jest.fn().mockResolvedValue(true);

beforeEach(() => {
    (global.navigator as any).mediaDevices = {
        getUserMedia,
    };
});

test("Should call all getUserMedia when getTracks is true", async () => {
    const { waitFor } = renderHook(() => useUserTracks(true));
    await waitFor(() => {
        expect(getUserMedia).toHaveBeenCalled();
    });
});

test("Should not call all getUserMedia when getTracks is false", async () => {
    const { waitFor } = renderHook(() => useUserTracks(false));
    await waitFor(() => {
        expect(getUserMedia).not.toHaveBeenCalled();
    });
});

test("Should not call all getUserMedia when getTracks is true but has audio/video streams and shouldUseCurrentStream is true", async () => {
    const audioStream = {};
    const videoStream = {};
    const { waitFor } = renderHook(() => useUserTracks(true, audioStream, videoStream, true));
    await waitFor(() => {
        expect(getUserMedia).not.toHaveBeenCalled();
    });
});

test("Should call all getUserMedia when getTracks is true but has audio/video streams and shouldUseCurrentStream is false", async () => {
    const audioStream = {};
    const videoStream = {};
    const { waitFor } = renderHook(() => useUserTracks(true, audioStream, videoStream, false));
    await waitFor(() => {
        expect(getUserMedia).toHaveBeenCalled();
    });
});
