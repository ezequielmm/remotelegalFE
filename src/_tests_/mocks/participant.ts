import dataTrackMock from "./dataTrack";
import buildTrack, { TRACK_TYPE } from "./videoTrack";

const participant: any = {
    videoTracks: new Map().set("item1", { track: buildTrack(TRACK_TYPE.video, true) }),
    audioTracks: new Map().set("item2", { track: buildTrack(TRACK_TYPE.audio, true) }),
    dataTracks: new Map().set("item3", dataTrackMock),
    on: jest.fn(),
    removeAllListeners: jest.fn(),
};
export default participant;
