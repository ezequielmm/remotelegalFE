import dataTrackMock from "./dataTrack";
import buildTrack, { TRACK_TYPE } from "./videoTrack";

export const getParticipant = (name = "test", role?, email?: string): any => ({
    sid: name,
    videoTracks: new Map().set("item1", { track: buildTrack(TRACK_TYPE.video, true) }),
    audioTracks: new Map().set("item2", { track: buildTrack(TRACK_TYPE.audio, true) }),
    dataTracks: new Map().set("item3", { track: dataTrackMock }),
    on: jest.fn(),
    identity: JSON.stringify({
        name,
        role,
        email,
    }),
    removeAllListeners: jest.fn(),
});

export const participantMap: any = new Map().set("item1", getParticipant("test"));

export const participantMapIdentity = "test";

export default getParticipant;
