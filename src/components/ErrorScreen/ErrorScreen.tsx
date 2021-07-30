import React from "react";
import { Row, Col } from "antd";
import Button from "prp-components-library/src/components/Button";
import Card from "prp-components-library/src/components/Card";
import Result from "prp-components-library/src/components/Result";
import { CustomStatus } from "prp-components-library/src/components/Result/Result";
import { StyledInDepoContainer } from "../../routes/InDepo/styles";

const ErrorScreen = ({
    onClick,
    texts,
}: {
    onClick: (e) => void;
    texts: {
        title: string;
        subtitle: string;
        button: string;
    };
}) => (
    <StyledInDepoContainer>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card>
                    <Result
                        title={texts.title}
                        subTitle={texts.subtitle}
                        status={CustomStatus.errorFetch}
                        extra={[
                            <Button type="primary" onClick={onClick} key="console" data-testid="error_screen_button">
                                {texts.button}
                            </Button>,
                        ]}
                    />
                </Card>
            </Col>
        </Row>
    </StyledInDepoContainer>
);
export default ErrorScreen;
