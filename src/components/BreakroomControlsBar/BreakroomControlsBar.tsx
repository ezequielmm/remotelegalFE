import React, { ReactElement } from "react";
import { LocalAudioTrack, LocalParticipant, LocalVideoTrack } from "twilio-video";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import {
    BreakroomTitle,
    BreakroomBadge,
    BreakroomDisclaimer,
    StyledContainer,
    StyledLeftControls,
    StyledLogo,
    StyledVideoControls,
    StyledGeneralControls,
    StyledPrimaryControls,
} from "./styles";
import Icon from "../Icon";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import { ReactComponent as EndCallIcon } from "../../assets/in-depo/End.call.svg";
import Control from "../Control/Control";
import Logo from "../Logo";

interface IBreakroomControlsBar {
    localParticipant: LocalParticipant;
    breakroomName: string;
}

export default function BreakroomControlsBar({ breakroomName, localParticipant }: IBreakroomControlsBar): ReactElement {
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, cameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );

    return (
        <StyledContainer>
            <StyledLeftControls>
                <StyledLogo>
                    <Logo version="light" height="100%" />
                </StyledLogo>
                <BreakroomTitle>
                    <BreakroomBadge>{breakroomName}</BreakroomBadge>
                    <BreakroomDisclaimer>Not recorded - Everything you say will remain private.</BreakroomDisclaimer>
                </BreakroomTitle>
            </StyledLeftControls>
            <StyledVideoControls>
                <Control
                    data-testid="audio"
                    type="circle"
                    onClick={() => setAudioEnabled(!isAudioEnabled)}
                    icon={
                        isAudioEnabled ? (
                            <Icon data-testid="unmuted" icon={UnmuteIcon} style={{ fontSize: "1.625rem" }} />
                        ) : (
                            <Icon data-testid="muted" icon={MuteIcon} style={{ fontSize: "1.625rem" }} />
                        )
                    }
                />
                <Control
                    data-testid="camera"
                    type="circle"
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    isToggled={cameraEnabled}
                    icon={
                        cameraEnabled ? (
                            <Icon data-testid="camerashown" icon={CameraOnIcon} style={{ fontSize: "1.625rem" }} />
                        ) : (
                            <Icon data-testid="camerahidden" icon={CameraOffIcon} style={{ fontSize: "1.625rem" }} />
                        )
                    }
                />
            </StyledVideoControls>
            <StyledGeneralControls>
                <StyledPrimaryControls>
                    <Control
                        data-testid="end"
                        onClick={() => {}}
                        type="rounded"
                        color="red"
                        label="Leave Breakroom"
                        icon={<Icon icon={EndCallIcon} style={{ fontSize: "1.625rem" }} />}
                    />
                </StyledPrimaryControls>
            </StyledGeneralControls>
        </StyledContainer>
    );
}
