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
    ${({ theme }) => {
        const antMenu = `
            .ant-menu {
                &-item {
                    padding: 0 ${getREM(theme.default.spaces[3])};
                    border-radius: ${getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};

                    &-group-title {
                        color: ${theme.default.whiteColor};
                        padding-top: ${getREM(theme.default.spaces[5])};
                        padding-bottom: 0;
                    }
                }
            }
            `;

        const buttonSmaller = `
            .ant-btn.ant-btn-primary {
                height: ${getREM(theme.default.spaces[8])};
                font-size: ${getREM(theme.default.fontSizes[8])};
            }
        `;

        const styles = `
            padding: ${getREM(theme.default.spaces[3])};

            .ant-layout-sider-children {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                & > :last-child {
                    padding: ${getREM(theme.default.spaces[1])};
                }
            }

            ${antMenu}
            ${buttonSmaller}
            `;

        return styles;
    }};
`;

const sider = (props: SiderProps) => {
    const { theme, ...rest } = props;

    return <StyledSider {...rest} _theme={theme} width="min-content" />;
};

export default sider;
