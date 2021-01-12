import styled from "styled-components";
import { Alert as ANTDAlert } from "antd";
import { getREM } from "../../constants/styles/utils";
import { IAlertProps } from "./Alert";

const StyledAlert = styled(ANTDAlert)<IAlertProps>`
    ${({ theme, type, float }) => {
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
            ${floatStyles}
        `;

        return styles;
    }}
`;

export default StyledAlert;
