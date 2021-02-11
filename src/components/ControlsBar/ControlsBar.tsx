import React, { ReactElement, useState } from "react";
import { LocalAudioTrack, LocalParticipant, LocalVideoTrack } from "twilio-video";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import useRecording from "../../hooks/InDepo/useRecording";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import EndDepoModal from "./components/EndDepoModal";
import CopyLink from "./components/CopyLink";
import { theme } from "../../constants/styles/theme";

import { StyledContainer, StyledLogo, StyledComposedIconContainer } from "./styles";
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
import Dropdown from "../Dropdown";
import Menu from "../Menu";
import Button from "../Button";
import Text from "../Typography/Text";
import Space from "../Space";
import Divider from "../Divider";
import Logo from "../Logo";
import useEndDepo from "../../hooks/InDepo/useEndDepo";
import useStreamAudio from "../../hooks/useStreamAudio";
import { BreakroomModel } from "../../models";
import ColorStatus from "../../types/ColorStatus";
import useJoinDepositionLink from "../../hooks/InDepo/useJoinDepositionLink";
import {
    CONTROLS_BAR_OFF_THE_RECORD_LABEL,
    CONTROLS_BAR_ON_THE_RECORD_LABEL,
    CONTROLS_BAR_END_LABEL,
    CONTROLS_BAR_EXHIBITS_LABEL,
    CONTROLS_BAR_REAL_TIME_LABEL,
    CONTROLS_BAR_BREAKROOMS_LABEL,
    CONTROLS_BAR_SUMMARY_LABEL,
    CONTROLS_BAR_SUPPORT_LABEL,
    CONTROLS_BAR_JOIN_BUTTON,
} from "../../constants/inDepo";
import { ThemeMode } from "../../types/ThemeType";
import { getREM } from "../../constants/styles/utils";

interface IControlsBar {
    breakrooms?: BreakroomModel.Breakroom[];
    canRecord: boolean;
    canEnd: boolean;
    localParticipant: LocalParticipant;
    exhibitsOpen: boolean;
    togglerExhibits: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    realTimeOpen: boolean;
    isRecording: boolean;
    togglerRealTime: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    handleJoinBreakroom: (roomNumber: string) => void;
}

export default function ControlsBar({
    breakrooms,
    localParticipant,
    exhibitsOpen,
    togglerExhibits,
    realTimeOpen,
    togglerRealTime,
    isRecording,
    canEnd,
    canRecord,
    handleJoinBreakroom,
}: IControlsBar): ReactElement {
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, isCameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const { startPauseRecording, loadingStartPauseRecording } = useRecording(!isRecording);
    const [summaryOpen, togglerSummary] = useState(false);
    const [supportOpen, togglerSupport] = useState(false);
    const [breakroomsOpen, togglerBreakrooms] = useState(false);
    const [modal, setModal] = useState(false);
    const { setEndDepo } = useEndDepo();
    const toggleMicrophone = useStreamAudio();
    const joinDepositionLink = useJoinDepositionLink();

    const toggleBreakrooms = () => togglerBreakrooms((prevState) => !prevState);
    const toggleSummary = () => togglerSummary((prevState) => !prevState);
    const toggleSupport = () => togglerSupport((prevState) => !prevState);
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);
    const toggleRealTime = () => togglerRealTime((prevState) => !prevState);

    React.useEffect(() => {
        toggleMicrophone(isRecording && isAudioEnabled);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording, isAudioEnabled]);

    const summaryTheme = { ...theme, mode: ThemeMode.default };

    const composeBreakroomsIcon = (
        <StyledComposedIconContainer>
            <Icon icon={BreakroomsIcon} size="1.625rem" />
            <Icon icon={ArrowIcon} rotate={180} size="1.625rem" />
        </StyledComposedIconContainer>
    );

    const renderBreakrooms = () => {
        const menuItems = [];

        breakrooms.forEach((item, i) => {
            menuItems.push(
                <Menu.Item disabled $unsetDisabledCursor key={item.id}>
                    <Space align="center" justify="space-between" size="large" fullWidth>
                        <Text block state={ColorStatus.white}>
                            {item.name}
                        </Text>
                        <Button onClick={() => handleJoinBreakroom(item.id)} type="link">
                            {CONTROLS_BAR_JOIN_BUTTON}
                        </Button>
                    </Space>
                </Menu.Item>
            );
            if (breakrooms.length > i + 1) menuItems.push(<Menu.Divider key={`${item.id}divider`} />);
        });

        return menuItems;
    };

    return (
        <StyledContainer px={6} align="center">
            <EndDepoModal
                endDepoFunc={() => {
                    setModal(false);
                    return setEndDepo(true);
                }}
                visible={modal}
                closeModal={() => setModal(false)}
            />
            <Space.Item flex="1 0 0">
                <StyledLogo>
                    <Logo version="light" height="100%" />
                </StyledLogo>
            </Space.Item>
            <Space.Item flex="1 0 0" fullHeight>
                <Space size={4} justify="center" align="center" fullHeight>
                    <Control
                        data-testid="audio"
                        type="circle"
                        onClick={() => setAudioEnabled(!isAudioEnabled)}
                        isActive={isAudioEnabled}
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
                        onClick={() => setCameraEnabled(!isCameraEnabled)}
                        isActive={isCameraEnabled}
                        icon={
                            isCameraEnabled ? (
                                <Icon data-testid="camerashown" icon={CameraOnIcon} size="1.625rem" />
                            ) : (
                                <Icon data-testid="camerahidden" icon={CameraOffIcon} size="1.625rem" />
                            )
                        }
                    />
                    {canRecord && (
                        <Control
                            disabled={loadingStartPauseRecording}
                            data-testid="record"
                            isActive={isRecording}
                            onClick={startPauseRecording}
                            type="rounded"
                            label={isRecording ? CONTROLS_BAR_OFF_THE_RECORD_LABEL : CONTROLS_BAR_ON_THE_RECORD_LABEL}
                            icon={
                                isRecording ? (
                                    <Icon icon={PauseIcon} size="1.625rem" />
                                ) : (
                                    <Icon icon={RecordIcon} size="1.625rem" />
                                )
                            }
                        />
                    )}

                    {canEnd && (
                        <Control
                            data-testid="end"
                            onClick={() => {
                                setModal(true);
                            }}
                            type="rounded"
                            color="red"
                            label={CONTROLS_BAR_END_LABEL}
                            icon={<Icon icon={EndCallIcon} size="1.625rem" />}
                        />
                    )}
                </Space>
            </Space.Item>
            <Space.Item flex="1 0 0" fullHeight>
                <Space justify="flex-end" align="center" fullHeight>
                    <Space align="center">
                        <Control
                            data-testid="exhibits"
                            isActive={exhibitsOpen}
                            onClick={toggleExhibits}
                            type="simple"
                            label={CONTROLS_BAR_EXHIBITS_LABEL}
                            icon={<Icon icon={ExhibitsIcon} size="1.625rem" />}
                        />
                        <Control
                            data-testid="realtime"
                            isActive={realTimeOpen}
                            onClick={toggleRealTime}
                            type="simple"
                            label={CONTROLS_BAR_REAL_TIME_LABEL}
                            icon={<Icon icon={RealTimeIcon} size="1.625rem" />}
                        />
                        {breakrooms && !!breakrooms.length && (
                            <Dropdown
                                onVisibleChange={toggleBreakrooms}
                                overlay={<Menu>{renderBreakrooms()}</Menu>}
                                arrow
                                styled
                                placement="topCenter"
                                trigger={["click"]}
                            >
                                <Control
                                    data-testid="breakrooms"
                                    isActive={breakroomsOpen}
                                    type="simple"
                                    label={CONTROLS_BAR_BREAKROOMS_LABEL}
                                    icon={composeBreakroomsIcon}
                                />
                            </Dropdown>
                        )}
                    </Space>
                    <Space py={3} fullHeight>
                        <Divider type="vertical" fitContent hasMargin={false} />
                    </Space>
                    <Space align="center">
                        <Dropdown
                            overlay={<CopyLink closePopOver={toggleSummary} link={joinDepositionLink} />}
                            placement="topRight"
                            onVisibleChange={(visible) => {
                                if (!visible) toggleSummary();
                            }}
                            visible={summaryOpen}
                            trigger={["click"]}
                            arrow
                            styled
                            overlayStyle={{ width: getREM(theme.default.spaces[6] * 23) }}
                            theme={summaryTheme}
                        >
                            <Control
                                isActive={summaryOpen}
                                onClick={toggleSummary}
                                type="simple"
                                label={CONTROLS_BAR_SUMMARY_LABEL}
                                icon={<Icon icon={SummaryIcon} size="1.625rem" />}
                            />
                        </Dropdown>
                        <Control
                            isActive={supportOpen}
                            onClick={toggleSupport}
                            type="simple"
                            label={CONTROLS_BAR_SUPPORT_LABEL}
                            icon={<Icon icon={SupportIcon} size="1.625rem" />}
                        />
                    </Space>
                </Space>
            </Space.Item>
        </StyledContainer>
    );
}
