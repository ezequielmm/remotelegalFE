import React from "react";
import styled from "styled-components";
import { Layout } from "antd";
import { SiderProps, SiderTheme } from "antd/lib/layout/Sider";
import { getREM, getPX } from "../../constants/styles/utils";

const { Sider } = Layout;

// change "theme" prop to "_theme", to avoid conflicts with the Styled Components "theme"
export interface ISiderProps extends Omit<SiderProps, "theme"> {
    _theme: SiderTheme;
}

const defaultSider = (props: ISiderProps) => {
    const { _theme } = props;
    return <Sider {...props} theme={_theme} />;
};

const StyledSider = styled(defaultSider)<ISiderProps>`
    ${({ theme, collapsed }) => {
        const antMenu = `
            .ant-menu {
                &-item {
                    padding: 0 ${getREM(theme.default.spaces[6])};
                    border-radius: ${getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};

                    &-group-title {
                        color: ${theme.default.whiteColor};
                        padding-top: ${getREM(theme.default.spaces[9])};
                        padding-bottom: 0;
                    }
                }
            }
            `;

        const buttonSmaller = `
            .ant-btn.ant-btn-primary {
                height: ${getREM(theme.default.spaces[8] * 2)};
                font-size: ${getREM(theme.default.fontSizes[8])};
            }
        `;

        const sideTrigger = `
            .ant-layout-sider-trigger{
                left: 0;
            }
        `;

        const collapsedStyles =
            collapsed === true
                ? `
                padding: ${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[3])} ${getREM(
                      theme.default.spaces[12] * 2
                  )};
                .ant-btn{
                    padding: 0  ${getREM(theme.default.spaces[3])};
                    .anticon{
                        font-size: ${getREM(theme.default.spaces[9])};
                        padding-top: ${getREM(theme.default.spaces[1])}
                    }
                }
                .sider__copyright{
                    transform: translateX(-100%);
                    opacity; 0;
                }
                .ant-menu-item{
                    padding: 0 ${getREM(theme.default.spaces[8])} !important;
                    color: transparent;
                    width: 100%;
                    .anticon{
                        font-size: ${getREM(theme.default.spaces[9])} !important;
                        line-height: 0 !important;
                    }
                    &:hover{
                        color: transparent;
                    }
                }
                .ant-menu-inline-collapsed{
                    width: 100%;
                }
                .ant-menu-item-group-title{
                    span{
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            `
                : `
                padding: ${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[6])} ${getREM(
                      theme.default.spaces[12] * 2
                  )};
            `;

        const styles = `
            overflow: hidden;
            .ant-btn{
                overflow: hidden;
            }
            .ant-layout-sider-children {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                & > :last-child {
                    padding: ${getREM(theme.default.spaces[3])};
                }
            }
            .sider__copyright{
                width: 208px;
                transform: translateX(0);
                opacity: 1;
                transition: all 0.3s;
            }
            .ant-menu-item-group-title{
                span{
                    position: relative;
                    display: inline-block;
                    transition: all 0.3s;
                    left: 0;
                    transform: translateX(0%);
                }
            }
            ${antMenu}
            ${buttonSmaller}
            ${sideTrigger}
            ${collapsedStyles}
            `;

        return styles;
    }};
`;

const sider = (props: SiderProps) => {
    const { theme, ...rest } = props;

    return <StyledSider {...rest} _theme={theme} width="240px" />;
};

export default sider;
