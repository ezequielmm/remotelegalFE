import React, { ReactElement, useState } from "react";
import { Dropdown, Menu } from "antd";
import { LocalAudioTrack, LocalParticipant, LocalVideoTrack } from "twilio-video";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import {
    StyledContainer,
    StyledLogo,
    StyledVideoControls,
    StyledGeneralControls,
    StyledPrimaryControls,
    StyledSecondaryControls,
    StyledComposedIconContainer,
} from "./styles";
import Icon from "../Icon";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import { ReactComponent as RecordIcon } from "../../assets/in-depo/Record.svg";
import { ReactComponent as PauseIcon } from "../../assets/in-depo/Pause.svg";
import { ReactComponent as EndCallIcon } from "../../assets/in-depo/End.call.svg";
import { ReactComponent as ExhibitsIcon } from "../../assets/in-depo/Exhibits.svg";
import { ReactComponent as RealTimeIcon } from "../../assets/in-depo/Real.time.svg";
import { ReactComponent as BreakroomsIcon } from "../../assets/in-depo/Breakrooms.svg";
import { ReactComponent as ArrowIcon } from "../../assets/general/Arrow.svg";
import { ReactComponent as SummaryIcon } from "../../assets/in-depo/Summary.svg";
import { ReactComponent as SupportIcon } from "../../assets/in-depo/Support.svg";
import Control from "../Control/Control";
import Logo from "../Logo";

interface IControlsBar {
    localParticipant: LocalParticipant;
    exhibitsOpen: boolean;
    togglerExhibits: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    realTimeOpen: boolean;
    togglerRealTime: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
}

export default function ControlsBar({
    localParticipant,
    exhibitsOpen,
    togglerExhibits,
    realTimeOpen,
    togglerRealTime,
}: IControlsBar): ReactElement {
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, cameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const [isRecording, togglerRecording] = useState(false);
    const [breakroomsOpen, togglerBreakrooms] = useState(false);
    const [summaryOpen, togglerSummary] = useState(false);
    const [supportOpen, togglerSupport] = useState(false);
    // TODO: Add EndDepo functionality
    // const { setEndDepo } = useEndDepo();

    const toggleRecord = () => togglerRecording((prevState) => !prevState);
    const toggleBreakrooms = () => togglerBreakrooms((prevState) => !prevState);
    const toggleSummary = () => togglerSummary((prevState) => !prevState);
    const toggleSupport = () => togglerSupport((prevState) => !prevState);
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);
    const toggleRealTime = () => togglerRealTime((prevState) => !prevState);

    const Panel = <Menu>Panel</Menu>;

    const composeBreakroomsIcon = (
        <StyledComposedIconContainer>
            <Icon icon={BreakroomsIcon} style={{ fontSize: "1.625rem" }} />
            <Icon icon={ArrowIcon} rotate={180} style={{ fontSize: "1.625rem" }} />
        </StyledComposedIconContainer>
    );

    return (
        <StyledContainer>
            <StyledLogo>
                <Logo version="light" height="100%" />
            </StyledLogo>
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
                <Control
                    data-testid="record"
                    isToggled={isRecording}
                    onClick={toggleRecord}
                    type="rounded"
                    label={isRecording ? "Go off the record" : "Go on the record"}
                    icon={
                        isRecording ? (
                            <Icon icon={PauseIcon} style={{ fontSize: "1.625rem" }} />
                        ) : (
                            <Icon icon={RecordIcon} style={{ fontSize: "1.625rem" }} />
                        )
                    }
                />
                <Control
                    data-testid="end"
                    onClick={() => {
                        // setEndDepo(true)
                    }}
                    type="rounded"
                    color="red"
                    label="End Deposition"
                    icon={<Icon icon={EndCallIcon} style={{ fontSize: "1.625rem" }} />}
                />
            </StyledVideoControls>
            <StyledGeneralControls>
                <StyledPrimaryControls>
                    <Control
                        data-testid="exhibits"
                        isToggled={exhibitsOpen}
                        onClick={toggleExhibits}
                        type="simple"
                        label="Exhibits"
                        icon={<Icon icon={ExhibitsIcon} style={{ fontSize: "1.625rem" }} />}
                    />
                    <Control
                        data-testid="realtime"
                        isToggled={realTimeOpen}
                        onClick={toggleRealTime}
                        type="simple"
                        label="Real Time"
                        icon={<Icon icon={RealTimeIcon} style={{ fontSize: "1.625rem" }} />}
                    />
                    <Control
                        data-testid="breakrooms"
                        isToggled={breakroomsOpen}
                        onClick={toggleBreakrooms}
                        type="simple"
                        label="Breakrooms"
                        icon={composeBreakroomsIcon}
                    />
                </StyledPrimaryControls>
                <StyledSecondaryControls>
                    <Dropdown overlay={Panel} placement="topRight" trigger={["click"]}>
                        <Control
                            isToggled={summaryOpen}
                            onClick={toggleSummary}
                            type="simple"
                            label="Summary"
                            icon={<Icon icon={SummaryIcon} style={{ fontSize: "1.625rem" }} />}
                        />
                    </Dropdown>
                    <Control
                        isToggled={supportOpen}
                        onClick={toggleSupport}
                        type="simple"
                        label="Support"
                        icon={<Icon icon={SupportIcon} style={{ fontSize: "1.625rem" }} />}
                    />
                </StyledSecondaryControls>
            </StyledGeneralControls>
        </StyledContainer>
    );
}
