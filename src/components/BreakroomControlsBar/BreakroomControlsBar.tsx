import React, { ReactElement, useState } from "react";
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
import Modal from "../Modal";
import Result from "../Result";
import Button from "../Button";
import {
    LEAVE_BREAKROOM_TITLE,
    LEAVE_BREAKROOM_SUBTITLE,
    LEAVE_BREAKROOM_STAY,
    LEAVE_BREAKROOM_LEAVE,
} from "../../constants/inBreakroom";

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, cameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);
    // eslint-disable-next-line no-unused-vars
    const handleCloseModal = (isLeaving: boolean) => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <Modal
                onlyBody
                destroyOnClose
                visible={isModalOpen}
                onCancel={() => handleCloseModal(false)}
                data-testid="modal"
            >
                <Result
                    title={LEAVE_BREAKROOM_TITLE}
                    subTitle={LEAVE_BREAKROOM_SUBTITLE}
                    extra={[
                        <Button type="text" onClick={() => handleCloseModal(false)}>
                            {LEAVE_BREAKROOM_STAY}
                        </Button>,
                        <Button type="primary" onClick={() => handleCloseModal(true)}>
                            {LEAVE_BREAKROOM_LEAVE}
                        </Button>,
                    ]}
                />
            </Modal>
            <StyledContainer>
                <StyledLeftControls>
                    <StyledLogo>
                        <Logo version="light" height="100%" />
                    </StyledLogo>
                    <BreakroomTitle>
                        <BreakroomBadge>{breakroomName}</BreakroomBadge>
                        <BreakroomDisclaimer>
                            Not recorded - Everything you say will remain private.
                        </BreakroomDisclaimer>
                    </BreakroomTitle>
                </StyledLeftControls>
                <StyledVideoControls>
                    <Control
                        data-testid="audio"
                        type="circle"
                        onClick={() => setAudioEnabled(!isAudioEnabled)}
                        isToggled={!isAudioEnabled}
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
                        isToggled={!cameraEnabled}
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
                    <StyledSecondaryControls>
                        <Control
                            data-testid="end"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                            type="rounded"
                            color="red"
                            label="Leave Breakroom"
                            icon={<Icon icon={EndCallIcon} size="1.625rem" />}
                        />
                    </StyledSecondaryControls>
                </StyledGeneralControls>
            </StyledContainer>
        </>
    );
}
