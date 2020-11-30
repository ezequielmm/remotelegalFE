import { renderHook } from "@testing-library/react-hooks";
import dataTrackMock from "../mocks/dataTrack";
import wrapper from "../mocks/wrapper";

import useDataTrack from "../../hooks/VideoChat/useDataTrack";

test("It calls dataTrack methods", async () => {
    const { rerender } = renderHook(() => useDataTrack([dataTrackMock]), { wrapper });
    expect(dataTrackMock.on).toHaveBeenCalled();
    rerender();
    expect(dataTrackMock.off).toHaveBeenCalled();
});
