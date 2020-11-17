import React from "react";
import { RemoteParticipant, Room } from "twilio-video";
import Participant from "../Participant/Participant";
import ControlsBar from "../../../components/ControlsBar/ControlsBar";
import {
    StyledParticipantContainer,
    StyledInDepoLayout,
    StyledVideoConference,
    StyledAttendeesContainer,
    StyledDeponentContainer,
    StyledInDepoContainer,
    StyledRoomFooter,
    StyledParticipantLoading,
} from "./styles";

const VideoChatRoom = ({
    room,
    connected,
    handleLogout,
}: {
    room: Room;
    connected: boolean;
    handleLogout: (ev: any) => any;
}) => {
    return (
        <StyledInDepoContainer>
            <StyledInDepoLayout>
                <StyledVideoConference>
                    <StyledDeponentContainer>
                        {!connected && <StyledParticipantLoading>Loading...</StyledParticipantLoading>}
                        {connected && <Participant participant={room.localParticipant} />}
                    </StyledDeponentContainer>
                    <StyledAttendeesContainer>
                        {connected && (Array.from(room.participants.values()).map((participant: RemoteParticipant) => (
                            <StyledParticipantContainer>
                                <Participant key={participant.sid} participant={participant} />
                            </StyledParticipantContainer>
                        )))}
                    </StyledAttendeesContainer>
                </StyledVideoConference>
            </StyledInDepoLayout>
            <StyledRoomFooter>
                <ControlsBar connected={connected} room={room} onEndCall={handleLogout} />
            </StyledRoomFooter>
        </StyledInDepoContainer>
    );
};

export default VideoChatRoom;
