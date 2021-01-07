import React from "react";
import styled from "styled-components";
import { Dropdown as ANTDropdown, Menu } from "antd";
import { DropDownProps } from "antd/lib/dropdown/dropdown";
import { ListProps } from "antd/lib/list";
import { MenuProps } from "antd/lib/menu";
import PopupContainer from "../PopupContainer";
import { getREM, hexToRGBA } from "../../constants/styles/utils";

export interface IDropdownProps extends Omit<DropDownProps, "overlay"> {
    children: React.ReactChild;
    overlay: {
        component: React.FC<ListProps<any>> | typeof Menu;
        props: ListProps<any> | MenuProps;
    };
}

const StyledPopupContainer = styled(PopupContainer)`
    ${({ theme }) => {
        const { neutrals, secondary } = theme.colors;
        const { textColor, textColorInverse, spaces } = theme.default;
        const styles = `
            .ant-dropdown-menu {
                background-color: ${theme.mode === "inDepo" ? secondary[5] : neutrals[6]};
                color: ${theme.mode === "inDepo" ? textColorInverse : textColor};
                padding: ${getREM(spaces[4])} 0;
                box-shadow: ${
                    theme.mode === "inDepo"
                        ? "none"
                        : `0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(neutrals[2], 0.08)}`
                };
            }
        `;
        return styles;
    }}
`;

const Dropdown = ({ children, overlay, ...props }: IDropdownProps) => (
    <StyledPopupContainer>
        <ANTDropdown
            overlay={<overlay.component {...overlay.props} />}
            getPopupContainer={(trigger) => trigger.parentElement}
            {...props}
        >
            {children}
        </ANTDropdown>
    </StyledPopupContainer>
);

export default Dropdown;
