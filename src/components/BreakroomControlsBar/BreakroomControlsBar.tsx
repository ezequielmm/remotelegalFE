import React, { ReactElement, useContext, useEffect, useState } from "react";
import { LocalAudioTrack, LocalParticipant, LocalVideoTrack } from "twilio-video";
import Confirm from "prp-components-library/src/components/Confirm";
import Divider from "prp-components-library/src/components/Divider";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Tag from "prp-components-library/src/components/Tag";
import Text from "prp-components-library/src/components/Text";
import { Col, Row } from "antd";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import { ReactComponent as BreakroomsIcon } from "../../assets/in-depo/Breakrooms.svg";
import { ReactComponent as LockBreakroomIcon } from "../../assets/icons/Lock.svg";
import { ReactComponent as UnLockBreakroomIcon } from "../../assets/icons/Unlock.svg";
import { ReactComponent as ExhibitsIcon } from "../../assets/in-depo/Exhibits.svg";
import { ReactComponent as KebebIcon } from "../../assets/icons/kebeb.svg";
import { theme } from "../../constants/styles/theme";
import Control from "../Control/Control";
import Logo from "../Logo";
import {
    StyledContainer,
    StyledDrawer,
    StyledDrawerSpace,
    StyledEndButton,
    StyledLogo,
    StyledMoreWrapper,
    StyledTagSpace,
} from "../ControlsBar/styles";
import { CONTROLS_BAR_BREAKROOMS_PRIVACITY_DESCRIPTION } from "../../constants/inDepo";
import {
    LEAVE_BREAKROOM_TITLE,
    LEAVE_BREAKROOM_SUBTITLE,
    LEAVE_BREAKROOM_STAY,
    LEAVE_BREAKROOM_LEAVE,
} from "../../constants/inBreakroom";
import ColorStatus from "../../types/ColorStatus";
import FloatingMessage from "../FloatingMessage";
import { WindowSizeContext } from "../../contexts/WindowSizeContext";

interface IBreakroomControlsBar {
    localParticipant: LocalParticipant;
    breakroomName: string;
    exhibitsOpen: boolean;
    togglerExhibits: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    rejoinDepo: () => void;
    lockRoom: (isLock: boolean) => void;
    isLocked: boolean;
}

export default function BreakroomControlsBar({
    breakroomName,
    localParticipant,
    exhibitsOpen,
    togglerExhibits,
    rejoinDepo,
    lockRoom,
    isLocked,
}: IBreakroomControlsBar): ReactElement {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, isCameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);
    const handleCloseModal = (isLeaving: boolean) => {
        setIsModalOpen(!isModalOpen);
        if (isLeaving) {
            rejoinDepo();
        }
    };

    const [toggledLockRoom, setToggledLockRoom] = useState<boolean>(false);
    const [windowWidth] = useContext(WindowSizeContext);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const widthMorethanLg = windowWidth >= parseInt(theme.default.breakpoints.lg, 10);

    useEffect(() => {
        setToggledLockRoom(isLocked);
    }, [isLocked]);

    const handleLockRoom = () => {
        setToggledLockRoom(!toggledLockRoom);
        lockRoom(!toggledLockRoom);
    };

    const handleDrawerVisible = () => {
        setDrawerVisible(!drawerVisible);
    };

    return (
        <>
            <Confirm
                title={LEAVE_BREAKROOM_TITLE}
                subTitle={LEAVE_BREAKROOM_SUBTITLE}
                negativeLabel={LEAVE_BREAKROOM_STAY}
                positiveLabel={LEAVE_BREAKROOM_LEAVE}
                visible={isModalOpen}
                onPositiveClick={() => handleCloseModal(true)}
                onNegativeClick={() => handleCloseModal(false)}
            >
                <span data-testid="modalconfirm" />
            </Confirm>

            <StyledContainer px={6} justify="space-between" align="center">
                {widthMorethanLg ? (
                    <Space.Item flex="2 0 0" fullHeight>
                        <Space size={6} align="center" fullHeight>
                            <StyledLogo>
                                <Logo version="light" height="100%" />
                            </StyledLogo>
                            <Space py={6} fullHeight>
                                <Divider type="vertical" fitContent hasMargin={false} />
                            </Space>
                            <Space size={2} direction="vertical">
                                <Tag>{breakroomName}</Tag>
                                <Text state={ColorStatus.white} size="small">
                                    {CONTROLS_BAR_BREAKROOMS_PRIVACITY_DESCRIPTION}
                                </Text>
                            </Space>
                        </Space>
                    </Space.Item>
                ) : (
                    <>
                        <StyledTagSpace>
                            <Tag>{breakroomName}</Tag>
                        </StyledTagSpace>
                        <FloatingMessage message={CONTROLS_BAR_BREAKROOMS_PRIVACITY_DESCRIPTION} />
                    </>
                )}
                <Space.Item flex="1 0 0" fullWidth>
                    <Space size={4} justify="center" align="center">
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
                    </Space>
                </Space.Item>
                {widthMorethanLg ? (
                    <Space.Item flex="2 0 0">
                        <Space justify="flex-end" align="center">
                            <Control
                                data-testid="lock_breakroom"
                                type="simple"
                                isActive={isLocked}
                                label="Lock Breakroom"
                                onClick={() => handleLockRoom()}
                                icon={
                                    <Icon icon={isLocked ? LockBreakroomIcon : UnLockBreakroomIcon} size="1.625rem" />
                                }
                            />
                            <Control
                                data-testid="end"
                                onClick={() => setIsModalOpen(!isModalOpen)}
                                type="simple"
                                color="red"
                                label="Leave Breakroom"
                                icon={<Icon icon={BreakroomsIcon} size="1.625rem" />}
                            />
                        </Space>
                    </Space.Item>
                ) : (
                    <>
                        <StyledMoreWrapper>
                            <Control
                                isActive
                                type="circle"
                                icon={<Icon icon={KebebIcon} color={theme.default.whiteColor} size="1.625rem" />}
                                onClick={handleDrawerVisible}
                            />
                        </StyledMoreWrapper>
                        <StyledDrawer
                            visible={drawerVisible}
                            onClose={handleDrawerVisible}
                            closable={false}
                            placement="bottom"
                            height="auto"
                            footer={
                                <StyledEndButton
                                    size="middle"
                                    icon={<Icon icon={BreakroomsIcon} size={6} color={theme.default.whiteColor} />}
                                    onClick={() => setIsModalOpen(!isModalOpen)}
                                >
                                    Leave Breakroom
                                </StyledEndButton>
                            }
                        >
                            <StyledDrawerSpace fullWidth align="center">
                                <Row style={{ width: "100%" }}>
                                    <Col xs={8}>
                                        <Control
                                            data-testid="lock_breakroom_mobile"
                                            type="simple"
                                            isActive={isLocked}
                                            label="Lock Breakroom"
                                            onClick={() => handleLockRoom()}
                                            icon={
                                                <Icon
                                                    icon={isLocked ? LockBreakroomIcon : UnLockBreakroomIcon}
                                                    size="1.625rem"
                                                />
                                            }
                                        />
                                    </Col>
                                </Row>
                            </StyledDrawerSpace>
                        </StyledDrawer>
                    </>
                )}
            </StyledContainer>
        </>
    );
}
