import React from "react";
import styled from "styled-components";
import { Radio } from "antd";
import { getREM } from "../../constants/styles/utils";

const StyledRadio = styled(Radio)`
    ${({ theme }) => {
        const styles = `
            &.ant-radio-wrapper {
                display: flex;
                align-items: center;
                margin-right: ${getREM(theme.default.spaces[7])};
                .ant-radio {
                    .ant-radio-inner {
                        width: ${getREM(theme.default.spaces[2])};
                        height: ${getREM(theme.default.spaces[2])};
                        border-color: ${theme.colors.disabled[6]};

                        &:after {
                            top: 2px;
                            left: 2px;
                        }
                    }

                    &.ant-radio-checked {
                        .ant-radio-inner {
                            border-color: ${theme.colors.primary[5]};
                        }
                    }
                }
            }
        `;
        return styles;
    }}
`;

const radio = (props) => <StyledRadio {...props} />;

export default radio;
