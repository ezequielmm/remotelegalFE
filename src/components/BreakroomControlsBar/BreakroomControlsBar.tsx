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
import { ReactComponent as ExhibitsIcon } from "../../assets/in-depo/Exhibits.svg";
import Control from "../Control/Control";
import Logo from "../Logo";
import { StyledSecondaryControls } from "../ControlsBar/styles";
import { CONTROLS_BAR_EXHIBITS_LABEL } from "../../constants/inDepo";

interface IBreakroomControlsBar {
    localParticipant: LocalParticipant;
    breakroomName: string;
    exhibitsOpen: boolean;
    togglerExhibits: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
}

export default function BreakroomControlsBar({
    breakroomName,
    localParticipant,
    exhibitsOpen,
    togglerExhibits,
}: IBreakroomControlsBar): ReactElement {
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, cameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);

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
                            <Icon data-testid="unmuted" icon={UnmuteIcon} size="1.625rem" />
                        ) : (
                            <Icon data-testid="muted" icon={MuteIcon} size="1.625rem" />
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
                            <Icon data-testid="camerashown" icon={CameraOnIcon} size="1.625rem" />
                        ) : (
                            <Icon data-testid="camerahidden" icon={CameraOffIcon} size="1.625rem" />
                        )
                    }
                />
            </StyledVideoControls>
            <StyledGeneralControls>
                {false && (
                    <StyledPrimaryControls>
                        <Control
                            data-testid="exhibits"
                            isToggled={exhibitsOpen}
                            onClick={toggleExhibits}
                            type="simple"
                            label={CONTROLS_BAR_EXHIBITS_LABEL}
                            icon={<Icon icon={ExhibitsIcon} size="1.625rem" />}
                        />
                    </StyledPrimaryControls>
                )}
                <StyledSecondaryControls>
                    <Control
                        data-testid="end"
                        onClick={() => {}}
                        type="rounded"
                        color="red"
                        label="Leave Breakroom"
                        icon={<Icon icon={EndCallIcon} size="1.625rem" />}
                    />
                </StyledSecondaryControls>
            </StyledGeneralControls>
        </StyledContainer>
    );
}
