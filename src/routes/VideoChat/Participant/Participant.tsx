import React from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import useDataTrack from "../../../hooks/VideoChat/useDataTrack";
import useParticipantTracks from "../../../hooks/VideoChat/useParticipantTracks";
import { StyledParticipantMask, StyledIdentityBox } from "./styles";
import Text from "../../../components/Typography/Text";

const AspectRatio = require("../../../assets/in-depo/aspect-ratio-16-9.svg");

const Participant = ({ participant }: { participant: LocalParticipant | RemoteParticipant }) => {
    const { videoRef, audioRef, dataTracks } = useParticipantTracks(participant);

    useDataTrack(dataTracks);

    return (
        <StyledParticipantMask>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            <img src={AspectRatio} alt="16/9" />
            <StyledIdentityBox>
                <Text size="small" weight="bold" state="white">
                    {participant.identity}
                </Text>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
