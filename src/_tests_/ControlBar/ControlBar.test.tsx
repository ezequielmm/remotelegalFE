import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "../../constants/styles/theme";
import ControlsBar from "../../components/ControlsBar/ControlsBar";
import { EventEmitter } from "events";
import "@testing-library/jest-dom";
import { noop } from "../../helpers/noop";
import GlobalState from "../../state/GlobalState";
import { combineReducersWithInitialStates } from "../../state/utils/combineReducers";
import RoomReducer, { RoomReducerIntialState } from "../../state/videoChat/videoChatReducer";

const rootReducer = combineReducersWithInitialStates({
    room: [RoomReducer, RoomReducerIntialState],
});

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
