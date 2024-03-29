import React from "react";
import { Row, Col } from "antd";
import Card from "@rl/prp-components-library/src/components/Card";
import Result from "@rl/prp-components-library/src/components/Result";
import Space from "@rl/prp-components-library/src/components/Space";
import styled from "styled-components";
import Logo from "../../../components/Logo";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import * as CONSTANTS from "../../../_tests_/constants/postDepo";

const StyledRow = styled(Row)`
    height: 100vh;
    background-color: ${theme.colors.neutrals[5]};
`;

export default function EndDepoScreen() {
    return (
        <StyledRow justify="center" align="middle">
            <Col sm={22} lg={18} xl={12} xxl={8}>
                <Card>
                    <Space p={getREM(6)} justify="center" align="center" fullWidth>
                        <Result
                            icon={<Logo version="dark" height={getREM(theme.default.spaces[8] * 2)} />}
                            title={CONSTANTS.END_DEPO_SCREEN_TEXT_FOR_WITNESS}
                        />
                    </Space>
                </Card>
            </Col>
        </StyledRow>
    );
}
