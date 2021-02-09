import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import BreakroomControlsBar from "../../../components/BreakroomControlsBar";
import ErrorScreen from "../../../components/ErrorScreen";
import RecordPill from "../../../components/RecordPill";
import Spinner from "../../../components/Spinner";
import * as CONSTANTS from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";
import disconnectFromDepo from "../../../helpers/disconnectFromDepo";
import { useJoinBreakroom, useJoinDeposition } from "../../../hooks/InDepo/depositionLifeTimeHooks";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ThemeMode } from "../../../types/ThemeType";
import Exhibits from "../Exhibits";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "../styles";
import VideoConference from "../VideoConference";

const Breakroom = () => {
    const inDepoTheme = { ...theme, mode: ThemeMode.inDepo };
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinBreakroom, loading, error] = useJoinBreakroom();
    const { breakrooms, currentBreakroom, timeZone, breakroomDataTrack } = state.room;
    const { breakroomID, depositionID } = useParams<{ depositionID: string; breakroomID: string }>();
    const currentBreakroomData = breakrooms?.find((breakroom) => breakroom.id === breakroomID);
    const [exhibitsOpen, togglerExhibits] = useState<boolean>(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState<number>(0);
    const [atendeesVisibility, setAtendeesVisibility] = useState<boolean>(true);
    const [joinDeposition] = useJoinDeposition();
    const history = useHistory();

    useEffect(() => {
        setAtendeesVisibility((prev) => !prev);
        setVideoLayoutSize([exhibitsOpen].filter(Boolean).length);
        setTimeout(() => setAtendeesVisibility((prev) => !prev), 300);
    }, [exhibitsOpen]);

    useEffect(() => {
        const cleanUpFunction = () => {
            disconnectFromDepo(currentBreakroom, dispatch, null, null, depositionID);
        };
        window.addEventListener("beforeunload", cleanUpFunction);

        return () => {
            disconnectFromDepo(currentBreakroom, dispatch, null, null, depositionID);
            window.removeEventListener("beforeunload", cleanUpFunction);
        };
    }, [currentBreakroom, dispatch, depositionID]);

    useEffect(() => {
        if (breakroomID) {
            joinBreakroom(breakroomID);
        }
    }, [breakroomID, joinBreakroom]);

    const handleRejoinDepo = () => {
        if (depositionID) {
            joinDeposition(depositionID);
            history.push(`/deposition/join/${depositionID}`);
        }
    };

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
                onClick={() => joinBreakroom(breakroomID)}
            />
        );
    }

    return currentBreakroom && breakroomDataTrack ? (
        <ThemeProvider theme={inDepoTheme}>
            <StyledInDepoContainer data-testid="videoconference">
                <StyledInDepoLayout>
                    <RecordPill on={false} />
                    <Exhibits visible={exhibitsOpen} />
                    <VideoConference
                        isBreakroom
                        localParticipant={currentBreakroom.localParticipant}
                        timeZone={timeZone}
                        attendees={currentBreakroom.participants}
                        layoutSize={videoLayoutSize}
                        atendeesVisibility={atendeesVisibility}
                    />
                </StyledInDepoLayout>
                <StyledRoomFooter>
                    <BreakroomControlsBar
                        breakroomName={currentBreakroomData?.name || ""}
                        localParticipant={currentBreakroom.localParticipant}
                        exhibitsOpen={exhibitsOpen}
                        togglerExhibits={togglerExhibits}
                        rejoinDepo={handleRejoinDepo}
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        </ThemeProvider>
    ) : null;
};

export default Breakroom;
