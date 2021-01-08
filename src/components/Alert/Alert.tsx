import { Alert as ANTDAlert } from "antd";
import { AlertProps } from "antd/lib/alert";
import React from "react";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

export interface IAlertProps extends AlertProps {}

const StyledAlert = styled(ANTDAlert)<IAlertProps>`
    ${({ theme, type }) => {
        const inDepotTheme = () => {
            const inDepoStyles = () => {
                const typeColor = type === "info" ? theme.colors.inDepoBlue[6] : theme.default[`${type}Color`];

                return `
                    background: ${typeColor};
                    border-color: ${typeColor};
                    color: ${theme.default.whiteColor};

                    .anticon, .ant-alert-message, .ant-alert-description, span {
                        color: ${theme.default.whiteColor};
                    }
                `;
            };

            return theme.mode === "inDepo" ? inDepoStyles() : "";
        };

        const styles = `
            padding: ${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[5])};
            padding-left: ${getREM(theme.default.spaces[12] + theme.default.spaces[5])};

            .ant-alert-icon {
                top: calc(${getREM(theme.default.spaces[9])} - 1px);
                left: ${getREM(theme.default.spaces[5])};
                transform: translateY(-50%);
                font-size: ${getREM(theme.default.spaces[8])};
            }

            .ant-alert-message {
                line-height: 1;
                display: block;
            }

            .ant-alert-description {
                line-height: 1.5;
                margin-top: ${getREM(theme.default.spaces[4])};
            }

            ${inDepotTheme()}
        `;

        return styles;
    }}
`;

const Alert = ({ showIcon = true, ...rest }: IAlertProps) => {
    return <StyledAlert showIcon={showIcon} {...rest} />;
};

export default Alert;
