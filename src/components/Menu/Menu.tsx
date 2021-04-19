import React from "react";
import { Menu as ANTMenu } from "antd";
import { MenuProps } from "antd/lib/menu";
import { MenuItemProps } from "antd/lib/menu/MenuItem";
import { MenuTheme } from "antd/lib/menu/MenuContext";
import styled, { useTheme } from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";

export interface IDefaultMenuProps extends Omit<MenuProps, "theme"> {
    menuTheme: MenuTheme;
}

export interface IMenuProps extends MenuProps {}

export interface IMenuItemProps extends MenuItemProps {
    $unsetDisabledCursor?: boolean;
}

const DefaultMenu = ({ menuTheme, ...rest }: IDefaultMenuProps) => <ANTMenu theme={menuTheme} {...rest} />;

const StyledMenu = styled(DefaultMenu)<IDefaultMenuProps>`
    ${({ theme, menuTheme }) => `
        &.ant-menu .ant-menu-item.ant-menu-item-only-child {
            margin-top: 0;
            margin-bottom: 0;
        }

        .ant-menu-item-divider {
            background-color: ${menuTheme === "dark" ? theme.colors.inDepoNeutrals[0] : theme.colors.neutrals[3]};
            margin: ${getREM(theme.default.spaces[3])} 0;
        }
    `}
`;

const Menu = (props: IMenuProps) => {
    const { children, theme, ...rest } = props;
    const currentTheme = useTheme();
    const defaultTheme: MenuTheme = theme || (currentTheme.mode === ThemeMode.default ? "light" : "dark");

    return (
        <StyledMenu menuTheme={defaultTheme} {...rest}>
            {children}
        </StyledMenu>
    );
};

const MenuItem = styled(ANTMenu.Item)<IMenuItemProps>`
    &.ant-menu-item-disabled {
        cursor: ${({ $unsetDisabledCursor }) => $unsetDisabledCursor && "unset !important"};
    }
    ${({ theme }) => {
        const { secondary } = theme.colors;
        const { textColorInverse } = theme.default;
        return `
            &:active{
                background-color: ${theme.mode === ThemeMode.inDepo ? secondary[5] : textColorInverse};
            }
        `;
    }}
`;

Menu.Item = MenuItem;
Menu.Divider = ANTMenu.Divider;
Menu.ItemGroup = ANTMenu.ItemGroup;
Menu.SubMenu = ANTMenu.SubMenu;

export default Menu;
