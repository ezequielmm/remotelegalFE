import { Col, Row } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Card from "@rl/prp-components-library/src/components/Card";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Result from "@rl/prp-components-library/src/components/Result";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import { ReactComponent as HelpIcon } from "../../assets/layout/Help.svg";
import * as CONSTANTS from "../../constants/help";
import ColorStatus from "../../types/ColorStatus";

const Help = () => {
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={12} xxl={10}>
                <Card>
                    <Space p={12}>
                        <Result
                            title={CONSTANTS.HELP_TITLE}
                            subTitle={
                                <Text state={ColorStatus.disabled} ellipsis={false}>
                                    <>
                                        {CONSTANTS.HELP_CONTENT1}
                                        <Button type="link" href={`mailto:${CONSTANTS.HELP_CONTENT2}`}>
                                            <Text state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                                {CONSTANTS.HELP_CONTENT2}
                                            </Text>{" "}
                                        </Button>
                                        {CONSTANTS.HELP_CONTENT3}
                                        <Button type="link" href={`tel:${CONSTANTS.HELP_CONTENT4}`}>
                                            <Text state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                                {CONSTANTS.HELP_CONTENT4}
                                            </Text>
                                        </Button>
                                        .
                                    </>
                                </Text>
                            }
                            status="info"
                            icon={<Icon icon={HelpIcon} />}
                        />
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};
export default Help;
