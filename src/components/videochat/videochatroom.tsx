import React from "react";
import styled from "styled-components";
import { RemoteParticipant, Room } from "twilio-video";
import { Button } from "antd";
import Participant from "./participant";

const StyledParticipantsContainer = styled.div`
    display: flex;
    div::first-child {
        background-color: green;
        width: 100px;
        height: 100px;
        margin: 6px;
        gap: 6px;
    }
`;

const StyledButton = styled(Button)`
    position: absolute;
    right: 5px;
    top: 5px;
`;

const VideoChatRoom = ({ room, handleLogout }: { room: Room; handleLogout: (ev: any) => any }) => {
    return (
        <>
            <Participant participant={room.localParticipant} isLocalParticipant showAudioControl={true}></Participant>
            <StyledButton onClick={handleLogout}>Disconnect</StyledButton>
            <StyledParticipantsContainer>
                {Array.from(room.participants.values()).map((participant: RemoteParticipant) => (
                    <Participant key={participant.sid} participant={participant}></Participant>
                ))}
            </StyledParticipantsContainer>
        </>
    );
};

export default VideoChatRoom;
