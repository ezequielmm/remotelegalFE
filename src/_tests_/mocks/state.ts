import dataTrackMock from "./dataTrack";

const state = {
    dispatch: jest.fn(),
    state: {
        room: {
            dataTrack: dataTrackMock,
            currentRoom: {},
        },
    },
};
export default state;
