import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { EventEmitter } from "events";
import React from "react";
import { ThemeProvider } from "styled-components";
import ControlsBar from "../../components/ControlsBar/ControlsBar";
import { theme } from "../../constants/styles/theme";
import { noop } from "../../helpers/noop";
import { IGlobalState } from "../../models/general";
import GlobalState from "../../state/GlobalState";
import combineReducers from "../../state/utils/combineReducers";
import RoomReducer, { RoomReducerIntialState } from "../../state/videoChat/videoChatReducer";

export const combinedReducer = combineReducers<IGlobalState>({
    room: RoomReducer,
});

export const initialState: IGlobalState = {
    room: RoomReducerIntialState,
};

export const rootReducer = {
    reducer: combinedReducer,
    initialState,
};

const videoTracksMocks = new Map();
videoTracksMocks.set("item1", { track: { kind: "video", enable: jest.fn() } });

const audioTracksMocks = new Map();
audioTracksMocks.set("item2", { track: { kind: "audio", enable: jest.fn() } });
class MockRoom extends EventEmitter {
    state = "connected";
    disconnect = jest.fn();

    localParticipant = {
        publishTrack: jest.fn(),
        videoTracks: videoTracksMocks,
        audioTracks: audioTracksMocks,
        on: jest.fn(),
    };
}

const mockRoom = new MockRoom();

test("expect to the control bar component display the remote legal logo", async () => {
    const { getByAltText } = render(
        <GlobalState rootReducer={rootReducer}>
            <ThemeProvider theme={theme}>
                <ControlsBar
                    localParticipant={mockRoom.localParticipant}
                    onEndCall={noop}
                    exhibitsOpen={false}
                    togglerExhibits={noop}
                    realTimeOpen={false}
                    togglerRealTime={noop}
                />
            </ThemeProvider>
        </GlobalState>
    );

    const Logo = getByAltText("Remote Legal logo");
    expect(Logo).toBeInTheDocument();
});
