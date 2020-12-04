import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import Exhibits from "../../components/Exhibits";
import RealTime from "../../components/RealTime";
import VideoConference from "../../components/VideoConference";
import ControlsBar from "../../components/ControlsBar";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "./styles";
import { useJoinDeposition } from "../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../state/GlobalState";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";
import ErrorScreen from "../../components/ErrorScreen";
import * as CONSTANTS from "../../constants/inDepo";

const InDepo = () => {
    type DepositionID = {
        depositionID: string;
    };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinDeposition, loading, error] = useJoinDeposition();
    const { message, currentRoom, witness } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const [realTimeOpen, togglerRealTime] = useState(false);
    const [exhibitsOpen, togglerExhibits] = useState(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState(0);
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
            disconnectFromDepo(currentRoom, dispatch);
        }
    }, [message, currentRoom, dispatch]);

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
        <StyledInDepoContainer data-testid="videoconference">
            <StyledInDepoLayout>
                <Exhibits onClick={() => togglerExhibits(false)} visible={exhibitsOpen} />
                <RealTime onClick={() => togglerRealTime(false)} visible={realTimeOpen} />
                <VideoConference
                    localParticipant={currentRoom.localParticipant}
                    witnessID={witness}
                    attendees={currentRoom.participants}
                    layoutSize={videoLayoutSize}
                />
            </StyledInDepoLayout>
            <StyledRoomFooter>
                <ControlsBar
                    realTimeOpen={realTimeOpen}
                    togglerRealTime={togglerRealTime}
                    exhibitsOpen={exhibitsOpen}
                    togglerExhibits={togglerExhibits}
                    localParticipant={currentRoom.localParticipant}
                />
            </StyledRoomFooter>
        </StyledInDepoContainer>
    ) : (
        <p>Thanks for joining the deposition</p>
    );
};

export default InDepo;
