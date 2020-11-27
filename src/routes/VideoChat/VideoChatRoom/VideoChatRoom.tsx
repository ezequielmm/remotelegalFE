import React, { useState, useEffect } from "react";
import { Room } from "twilio-video";
import { Row, Col, Spin } from "antd";
import Card from "../../../components/Card";
import Result from "../../../components/Result";
import Button from "../../../components/Button";
import Exhibits from "../../../components/Exhibits";
import RealTime from "../../../components/RealTime";
import VideoConference from "../../../components/VideoConference";
import ControlsBar from "../../../components/ControlsBar/ControlsBar";
import { StyledInDepoContainer, StyledInDepoLayout, StyledRoomFooter } from "./styles";
import * as CONSTANTS from "../../../constants/inDepo";

const VideoChatRoom = ({ room, loading }: { room: Room; loading: boolean }) => {
    const [realTimeOpen, togglerRealTime] = useState(false);
    const [exhibitsOpen, togglerExhibits] = useState(false);
    const [videoLayoutSize, setVideoLayoutSize] = useState(0);

    useEffect(() => setVideoLayoutSize([realTimeOpen, exhibitsOpen].filter(Boolean).length), [
        realTimeOpen,
        exhibitsOpen,
    ]);

    const tryAgain = () => {}; // TODO fetch again

    if (loading) {
        return (
            <Row justify="center" align="middle" style={{ height: "100vh" }}>
                <Spin size="large" />
            </Row>
        );
    }
    if (!room) {
        return (
            <StyledInDepoContainer>
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={24} lg={18} xl={13} xxl={10}>
                        <Card>
                            <Result
                                title={CONSTANTS.FETCH_ERROR_RESULT_TITLE}
                                subTitle={CONSTANTS.FETCH_ERROR_RESULT_BODY}
                                status="error-fetch"
                                extra={[
                                    <Button
                                        type="primary"
                                        onClick={() => tryAgain()}
                                        key="console"
                                        data-testid="new_case_button"
                                    >
                                        {CONSTANTS.FETCH_ERROR_RESULT_BUTTON}
                                    </Button>,
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </StyledInDepoContainer>
        );
    }

    return (
        room && (
            <StyledInDepoContainer>
                <StyledInDepoLayout>
                    <Exhibits onClick={() => togglerExhibits(false)} visible={exhibitsOpen} />
                    <RealTime onClick={() => togglerRealTime(false)} visible={realTimeOpen} />
                    <VideoConference
                        deponent={room?.localParticipant}
                        antendees={room?.participants}
                        layoutSize={videoLayoutSize}
                    />
                </StyledInDepoLayout>
                <StyledRoomFooter>
                    <ControlsBar
                        realTimeOpen={realTimeOpen}
                        togglerRealTime={togglerRealTime}
                        exhibitsOpen={exhibitsOpen}
                        togglerExhibits={togglerExhibits}
                        localParticipant={room?.localParticipant}
                    />
                </StyledRoomFooter>
            </StyledInDepoContainer>
        )
    );
};

export default VideoChatRoom;
