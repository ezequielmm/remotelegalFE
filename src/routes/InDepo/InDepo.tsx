import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Spinner from "../../components/Spinner";
import Exhibits from "./Exhibits";
import RealTime from "./RealTime";
import VideoConference from "./VideoConference";
import ControlsBar from "../../components/ControlsBar";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "./styles";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import ErrorScreen from "../../components/ErrorScreen";
import * as CONSTANTS from "../../constants/inDepo";
import { theme } from "../../constants/styles/theme";
import RecordPill from "../../components/RecordPill";
import { DepositionID } from "../../state/types";
import actions from "../../state/InDepo/InDepoActions";

const InDepo = () => {
    const inDepoTheme = { ...theme, mode: "inDepo" };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDeposition();
    const { message, currentRoom, witness, timeZone } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState(false);
    const [exhibitsOpen, togglerExhibits] = useState(false);
    const [isRecording, togglerRecording] = useState(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState(0);
    const history = useHistory();

    useEffect(() => {
        return () => disconnectFromDepo(currentRoom, dispatch);
    }, [currentRoom, dispatch]);

    useEffect(() => {
        if (depositionID) {
            joinDeposition(depositionID);
        }
    }, [depositionID, joinDeposition]);

    useEffect(() => setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length), [
        realTimeOpen,
        exhibitsOpen,
    ]);

    useEffect(() => {
        if (message.module === "endDepo") {
            disconnectFromDepo(currentRoom, dispatch, history);
        }
        if (message.module === "recordDepo") {
            togglerRecording(message.value);
        }
        if (message.module === "addTranscription") {
            dispatch(actions.addTranscription(message.value));
        }
    }, [message, currentRoom, dispatch, history]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <ErrorScreen
                texts={{
                    title: CONSTANTS.FETCH_ERROR_RESULT_TITLE,
                    subtitle: CONSTANTS.FETCH_ERROR_RESULT_BODY,
                    button: CONSTANTS.FETCH_ERROR_RESULT_BUTTON,
                }}
                onClick={() => joinDeposition(depositionID)}
            />
        );
    }

    return currentRoom ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference">
                <StyledInDepoLayout>
                    <RecordPill on={isRecording} />
                    <Exhibits visible={exhibitsOpen} />
                    <RealTime visible={realTimeOpen} />
                    <VideoConference
                        localParticipant={currentRoom.localParticipant}
                        witnessID={witness}
                        timeZone={timeZone}
                        attendees={currentRoom.participants}
                        layoutSize={videoLayoutSize}
                    />
                </StyledInDepoLayout>
                <StyledRoomFooter>
                    <ControlsBar
                        isRecording={isRecording}
                        togglerRecording={togglerRecording}
                        realTimeOpen={realTimeOpen}
                        togglerRealTime={togglerRealTime}
                        exhibitsOpen={exhibitsOpen}
                        togglerExhibits={togglerExhibits}
                        localParticipant={currentRoom.localParticipant}
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default InDepo;
