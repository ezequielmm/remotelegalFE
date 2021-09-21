export enum TRACK_TYPE {
    video = "video",
    audio = "audio",
}

const buildTrack = (kind: TRACK_TYPE, isEnabled): any => ({
    kind,
    mediaStreamTrack: {
        onended: jest.fn(),
    },
    setSinkId: jest.fn(),
    restart: jest.fn(),
    attach: jest.fn(),
    detach: jest.fn(),
    isEnabled: !!isEnabled,
    disable: jest.fn(),
    enable: jest.fn(),
});
export default buildTrack;
