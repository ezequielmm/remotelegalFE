import dataTrackMock from "./dataTrack";

const state = {
    dispatch: jest.fn(),
    state: {
        room: {
            initialCameraStatus: null,
            dataTrack: dataTrackMock,
            currentRoom: {},
        },
    },
};

export default state;
