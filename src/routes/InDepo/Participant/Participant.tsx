import React from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import useDataTrack from "../../../hooks/InDepo/useDataTrack";
import useParticipantTracks from "../../../hooks/InDepo/useParticipantTracks";
import { TimeZones } from "../../../models/general";
import Clock from "../../../components/Clock";
import Text from "../../../components/Typography/Text";
import { StyledIdentityBox, StyledParticipantMask, StyledTimeBox } from "./styles";
import ColorStatus from "../../../types/ColorStatus";

const AspectRatio = require("../../../assets/in-depo/aspect-ratio-16-9.svg");

const Participant = ({
    timeZone,
    participant,
}: {
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
}) => {
    const { videoDisabled, videoRef, audioRef, dataTracks } = useParticipantTracks(participant);
    useDataTrack(dataTracks);

    return (
        <StyledParticipantMask videoDisabled={videoDisabled}>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            <img src={AspectRatio} alt="16/9" />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            <StyledIdentityBox>
                <Text size="default" weight="bold" state={ColorStatus.white}>
                    {participant?.identity ? participant.identity : "waiting for witness"}
                </Text>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
