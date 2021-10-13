import { useContext } from "react";
import { Row, Col } from "antd";
import Button from "prp-components-library/src/components/Button";
import Card from "prp-components-library/src/components/Card";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import Logo from "../../../components/Logo";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import { useEndDepoDownloadAssets } from "../../../hooks/endDepo/hooks";
import { StyledEndDepoScreenLayout } from "./styles";
import EndDepoScreenForWitness from "./EndDepoScreenForWitness";
import * as CONSTANTS from "../../../_tests_/constants/postDepo";
import { displayName } from "../../../helpers/displayName";
import { GlobalStateContext } from "../../../state/GlobalState";

export default function EndDepoScreen({ location }) {
    const { state } = useContext(GlobalStateContext);
    const { currentUser } = state?.user;
    const { downloadAssets } = useEndDepoDownloadAssets(location?.state?.depositionID);
    if (location?.state?.isWitness) {
        return <EndDepoScreenForWitness />;
    }
    return (
        <StyledEndDepoScreenLayout>
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Col xs={22} sm={20} lg={16} xl={10} xxl={8}>
                    <Card
                        style={{
                            padding: `${getREM(theme.default.spaces[10] * 2)} 
                                ${getREM(theme.default.spaces[9] * 4)}`,
                        }}
                    >
                        <Space direction="vertical" size="large" justify="center" align="center" fullWidth>
                            <Space pb={3}>
                                <Logo version="dark" height={getREM(theme.default.spaces[8] * 2)} />
                            </Space>
                            <Space.Item style={{ textAlign: "center" }}>
                                <Title weight="light" level={5} ellipsis={false} noMargin>
                                    {`${displayName(currentUser?.firstName, currentUser?.lastName)}, ${
                                        CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT
                                    }`}
                                </Title>
                            </Space.Item>
                            <Text state={ColorStatus.disabled} size="large" ellipsis={false} align="center">
                                {CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT}
                            </Text>
                            <Button
                                onClick={() => downloadAssets(currentUser)}
                                type="primary"
                                size="middle"
                                data-testid="download_assets_button"
                            >
                                {CONSTANTS.END_DEPO_DOWNLOAD_BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </StyledEndDepoScreenLayout>
    );
}
