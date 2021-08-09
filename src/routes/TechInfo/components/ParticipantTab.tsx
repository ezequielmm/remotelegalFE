import Title from "prp-components-library/src/components/Title";
import Text from "prp-components-library/src/components/Text";
import Space from "prp-components-library/src/components/Space";
import ColorStatus from "prp-components-library/src/types/ColorStatus";
import Divider from "prp-components-library/src/components/Divider";
import { Status } from "prp-components-library/src/components/StatusPill/StatusPill";
import { Col } from "antd/lib/grid";
import Row from "antd/lib/row";
import * as CONSTANTS from "../../../constants/techInfo";
import { StyledStatusPill } from "../styles";
import normalizedRoles from "../../../constants/roles";
import { DevicesStatus } from "../../../constants/TroubleShootUserDevices";

interface ParticipantTabProps {
    ParticipantInfo: CONSTANTS.ParticipantInfo;
}

const ParticipantTab = ({ ParticipantInfo }: ParticipantTabProps) => (
    <>
        <Title
            dataTestId={`${ParticipantInfo.name} | ${normalizedRoles[ParticipantInfo.role] || ParticipantInfo.role}`}
            level={4}
            weight="regular"
        >
            {`${ParticipantInfo.name} | ${normalizedRoles[ParticipantInfo.role] || ParticipantInfo.role}`}
        </Title>
        <Space mt={2} direction="vertical" size={4}>
            <Title dataTestId={CONSTANTS.PARTICIPANT_TAB_SUBHEADER} level={5} weight="regular">
                {CONSTANTS.PARTICIPANT_TAB_SUBHEADER}
            </Title>
            <Row style={{ width: "100%" }}>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_HEADERS.NAME}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_HEADERS.NAME}
                    </Text>
                    <Text dataTestId={ParticipantInfo.name} block>
                        {ParticipantInfo.name}
                    </Text>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_HEADERS.EMAIL}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_HEADERS.EMAIL}
                    </Text>
                    <Text dataTestId={ParticipantInfo.email} block>
                        {ParticipantInfo.email}
                    </Text>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_HEADERS.ROLE}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_HEADERS.ROLE}
                    </Text>
                    <Text dataTestId={ParticipantInfo.role} block>
                        {normalizedRoles[ParticipantInfo.role] || ParticipantInfo.role}
                    </Text>
                </Col>
            </Row>
            <Row style={{ width: "100%" }}>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_HEADERS.HAS_JOINED}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_HEADERS.HAS_JOINED}
                    </Text>
                    <StyledStatusPill
                        data-testid={ParticipantInfo.hasJoined ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                        status={ParticipantInfo.hasJoined ? Status.completed : Status.canceled}
                        icon={false}
                    >
                        {ParticipantInfo.hasJoined ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                    </StyledStatusPill>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_HEADERS.ADMITED}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_HEADERS.ADMITED}
                    </Text>
                    <StyledStatusPill
                        data-testid={ParticipantInfo.isAdmitted ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                        status={ParticipantInfo.isAdmitted ? Status.completed : Status.canceled}
                        icon={false}
                    >
                        {ParticipantInfo.isAdmitted ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                    </StyledStatusPill>
                </Col>
            </Row>
        </Space>
        <Space mt={10} direction="vertical" size={4}>
            <Title dataTestId={CONSTANTS.PARTICIPANT_TAB_GENERAL_SUBHEADER} level={5} weight="regular">
                {CONSTANTS.PARTICIPANT_TAB_GENERAL_SUBHEADER}
            </Title>
            <Text dataTestId={CONSTANTS.PARTICIPANT_TAB_SYSTEM_SUBHEADER} weight="bold" size="small">
                {CONSTANTS.PARTICIPANT_TAB_SYSTEM_SUBHEADER}
            </Text>
            <Row style={{ width: "100%" }}>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.OS}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.OS}
                    </Text>
                    <Text dataTestId={ParticipantInfo.operatingSystem} block>
                        {ParticipantInfo.operatingSystem}
                    </Text>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.DEVICE}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.DEVICE}
                    </Text>
                    <Text
                        dataTestId={ParticipantInfo.device
                            ?.toLowerCase()
                            ?.split(" ")
                            ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            ?.join(" ")}
                        block
                    >
                        {ParticipantInfo.device
                            ?.toLowerCase()
                            ?.split(" ")
                            ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            ?.join(" ")}
                    </Text>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.BROWSER}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.BROWSER}
                    </Text>
                    <Text dataTestId={ParticipantInfo.browser} block>
                        {ParticipantInfo.browser}
                    </Text>
                </Col>
            </Row>
            <Row style={{ width: "100%" }}>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.IP}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.IP}
                    </Text>
                    <Text dataTestId={ParticipantInfo.ip} block>
                        {ParticipantInfo.ip}
                    </Text>
                </Col>
            </Row>
            <Divider hasMargin={false} />
            <Space mt={5}>
                <Text dataTestId={CONSTANTS.PARTICIPANT_TAB_DEVICES_SUBHEADER} size="small" weight="bold">
                    {CONSTANTS.PARTICIPANT_TAB_DEVICES_SUBHEADER}
                </Text>
            </Space>
            <Row style={{ width: "100%" }}>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.camera}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.camera}
                    </Text>
                    <StyledStatusPill
                        status={
                            ParticipantInfo.devices.camera.status?.toLowerCase() === DevicesStatus.enabled
                                ? Status.completed
                                : Status.canceled
                        }
                        data-testid={ParticipantInfo.devices.camera.status || CONSTANTS.NO_CAMERA_INFO}
                        icon={false}
                    >
                        {ParticipantInfo.devices.camera.status || CONSTANTS.NO_CAMERA_INFO}
                    </StyledStatusPill>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.microphone}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.microphone}
                    </Text>
                    <Text dataTestId={ParticipantInfo.devices.microphone.name || CONSTANTS.NO_MIC_INFO} block>
                        {ParticipantInfo.devices.microphone.name || CONSTANTS.NO_MIC_INFO}
                    </Text>
                </Col>
                <Col lg={8}>
                    <Text
                        dataTestId={CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.speaker}
                        block
                        state={ColorStatus.disabled}
                        size="small"
                        weight="bold"
                    >
                        {CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS.speaker}
                    </Text>
                    <Text dataTestId={ParticipantInfo.devices.speakers.name} block>
                        {ParticipantInfo.devices.speakers.name}
                    </Text>
                </Col>
            </Row>
        </Space>
    </>
);
export default ParticipantTab;
