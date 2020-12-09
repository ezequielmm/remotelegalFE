import React from "react";
import { Row, Col } from "antd";
import { StyledInDepoContainer } from "../../routes/InDepo/styles";
import Card from "../Card";
import Result from "../Result";
import Button from "../Button";
import { CustomStatus } from "../Result/Result";

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
                            <Button type="primary" onClick={onClick} key="console" data-testid="new_case_button">
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
