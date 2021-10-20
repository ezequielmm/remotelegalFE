import Text from "@rl/prp-components-library/src/components/Text";
import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import Title from "@rl/prp-components-library/src/components/Title";
import { Col } from "antd/lib/grid";
import Row from "antd/lib/row";
import Space from "@rl/prp-components-library/src/components/Space";
import ColorStatus from "@rl/prp-components-library/src/types/ColorStatus";
import * as CONSTANTS from "../../../constants/techInfo";
import { StyledStatusPill } from "../styles";

interface OverViewProps {
    depositionInfo: CONSTANTS.DepositionInfo;
}

const OverView = ({ depositionInfo }: OverViewProps) => {
    const { roomId, isVideoRecordingNeeded, isRecording, sharingExhibit } = depositionInfo;
    return (
        <>
            <Title dataTestId={CONSTANTS.OVERVIEW_HEADER} level={4} weight="regular">
                {CONSTANTS.OVERVIEW_HEADER}
            </Title>
            <Space mt={2} direction="vertical" size={4}>
                <Title dataTestId={CONSTANTS.OVERVIEW_SUBHEADER} level={5} weight="regular">
                    {CONSTANTS.OVERVIEW_SUBHEADER}
                </Title>
                <Row style={{ width: "100%" }}>
                    <Col lg={8}>
                        <Text
                            dataTestId={CONSTANTS.OVERVIEW_INFO_HEADERS.ROOM}
                            block
                            state={ColorStatus.disabled}
                            size="small"
                            weight="bold"
                        >
                            {CONSTANTS.OVERVIEW_INFO_HEADERS.ROOM}
                        </Text>
                        <Text block>{roomId}</Text>
                    </Col>
                    <Col lg={8}>
                        <Text
                            dataTestId={CONSTANTS.OVERVIEW_INFO_HEADERS.RECORDING_TYPE}
                            block
                            state={ColorStatus.disabled}
                            size="small"
                            weight="bold"
                        >
                            {CONSTANTS.OVERVIEW_INFO_HEADERS.RECORDING_TYPE}
                        </Text>
                        <Text dataTestId={isVideoRecordingNeeded ? CONSTANTS.VIDEO : CONSTANTS.AUDIO} block>
                            {isVideoRecordingNeeded ? CONSTANTS.VIDEO : CONSTANTS.AUDIO}
                        </Text>
                    </Col>
                    <Col lg={8}>
                        <Text
                            dataTestId={CONSTANTS.OVERVIEW_INFO_HEADERS.ON_THE_RECORD}
                            block
                            state={ColorStatus.disabled}
                            size="small"
                            weight="bold"
                        >
                            {CONSTANTS.OVERVIEW_INFO_HEADERS.ON_THE_RECORD}
                        </Text>
                        <StyledStatusPill
                            data-testid={isRecording ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                            status={Status.completed}
                            icon={false}
                        >
                            {isRecording ? CONSTANTS.YES_TAG : CONSTANTS.NO_TAG}
                        </StyledStatusPill>
                    </Col>
                </Row>
                <Row style={{ width: "100%" }}>
                    <Col lg={8}>
                        <Text
                            dataTestId={CONSTANTS.OVERVIEW_INFO_HEADERS.SHARING_EXHIBIT}
                            block
                            state={ColorStatus.disabled}
                            size="small"
                            weight="bold"
                        >
                            {CONSTANTS.OVERVIEW_INFO_HEADERS.SHARING_EXHIBIT}
                        </Text>
                        <Text dataTestId={sharingExhibit} block>
                            {sharingExhibit || CONSTANTS.NO_EXHIBIT_INFO}
                        </Text>
                    </Col>
                </Row>
            </Space>
        </>
    );
};

export default OverView;
