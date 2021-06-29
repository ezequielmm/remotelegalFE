import { renderHook } from "@testing-library/react-hooks";
import useVolumeLevel from "../../hooks/useVolumeMeter";

const mockaudioContext = jest.fn();
let mockcreateMediaStreamSource;
let mockgetByteFrequencyData;
let mockcreateAnalyser;
let mockConnect;

beforeEach(() => {
    mockcreateMediaStreamSource = jest.fn();
    mockgetByteFrequencyData = jest.fn();
    mockcreateAnalyser = jest.fn(() => {
        return {
            connect: mockConnect,
            frequencyBinCount: [0, 1, 2],
            getByteFrequencyData: mockgetByteFrequencyData,
        };
    });
    (window as any).AudioContext = mockaudioContext;
    mockConnect = jest.fn();
    mockaudioContext.mockImplementation(() => {
        return {
            createAnalyser: mockcreateAnalyser,
            createMediaStreamSource: mockcreateMediaStreamSource,
        };
    });
    mockcreateMediaStreamSource.mockImplementation(() => {
        return {
            connect: mockConnect,
        };
    });
});

test("Should call all the right AudioContext methods", async () => {
    const stream: any = "stream";
    const { waitFor } = renderHook(() => useVolumeLevel(stream));
    await waitFor(() => {
        expect(mockcreateMediaStreamSource).toHaveBeenCalledWith(stream);
        expect(mockcreateAnalyser).toHaveBeenCalled();
        expect(mockConnect).toHaveBeenCalled();
        expect(mockgetByteFrequencyData).toHaveBeenCalled();
    });
});
