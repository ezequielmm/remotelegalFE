import styled from "styled-components";
import { Alert as ANTDAlert } from "antd";
import { getREM } from "../../constants/styles/utils";
import { IAlertProps } from "./Alert";
import { ThemeMode } from "../../types/ThemeType";

const StyledAlert = styled(ANTDAlert)<IAlertProps>`
    ${({ theme, type, float, fullWidth = true }) => {
        const alertPadding = `${getREM(theme.default.spaces[4])} ${getREM(theme.default.spaces[5])}`;
        const inDepotTheme = () => {
            const inDepoStyles = () => {
                const typeColor = type === "info" ? theme.colors.inDepoBlue[6] : theme.default[`${type}Color`];

                return `
                    background: ${typeColor};
                    border-color: ${typeColor};
                    color: ${theme.default.whiteColor};
                    width: ${fullWidth ? "100%" : "auto"};
                    .anticon, .ant-alert-message, .ant-alert-description, span {
                        color: ${theme.default.whiteColor};
                    }
                `;
            };

            return theme.mode === ThemeMode.inDepo ? inDepoStyles() : "";
        };

        const floatStyles =
            float &&
            `
                position: fixed;
                left: 50%;
                transform: translate(-50%, 0);
                animation: showMessage 0.25s;
                top: 12px;
                z-index: 999;

                @keyframes showMessage{
                    from { 
                        top: -100px;
                        opacity: 0; 
                    }
                    to { 
                        top: 12px;
                        opacity: 1;
                    }
                }
            `;

        const styles = `
            width: ${fullWidth ? "100%" : "auto"};
            padding: ${alertPadding};
            padding-left: ${getREM(theme.default.spaces[12] + theme.default.spaces[5])};

            .ant-alert-icon {
                top: calc(${getREM(theme.default.spaces[9])} - 1px);
                left: ${getREM(theme.default.spaces[5])};
                transform: translateY(-50%);
                font-size: ${getREM(theme.default.spaces[8])};
            }

            .ant-alert-message {
                display: block;
            }

            .ant-alert-close-icon, &.ant-alert-no-icon .ant-alert-close-icon{ 
                top: calc(${getREM(theme.default.spaces[9])} - 2px); 
                right: ${getREM(theme.default.spaces[4])}; 
                transform: translateY(-50%); 
            }

            .ant-alert-description {
                line-height: 1.5;
                margin-top: ${getREM(theme.default.spaces[4])};
            }
            &.ant-alert-no-icon{
                padding: ${alertPadding};
            }
            &.ant-alert-closable{
                padding-right: ${getREM(theme.default.spaces[12] + theme.default.spaces[5])};
            }

            ${inDepotTheme()}
            ${floatStyles}
        `;

        return styles;
    }}
`;

export default StyledAlert;
