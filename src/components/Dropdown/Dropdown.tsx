import React from "react";
import styledComponent from "styled-components";
import { Dropdown as ANTDropdown } from "antd";
import { DropDownProps } from "antd/lib/dropdown/dropdown";
import PopupContainer from "../PopupContainer";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { Theme, ThemeMode } from "../../types/ThemeType";

export interface IDropdownProps extends Omit<DropDownProps, "overlay"> {
    overlay: JSX.Element;
    children: React.ReactChild;
    styled?: boolean;
    theme?: Theme;
    dataTestId?: string;
}

const StyledPopupContainer = styledComponent(PopupContainer)<{ $styled?: boolean }>`
    ${({ theme, $styled }) => {
        const { secondary } = theme.colors;
        const { spaces, whiteColor } = theme.default;
        const arrowColor = theme.mode === ThemeMode.inDepo ? secondary[5] : whiteColor;
        return (
            $styled &&
            `
                .ant-dropdown-arrow {
                    border-color: transparent;
                    width: 0;
                    height: 0;
                    border-width: ${getREM(spaces[5] / 2)};
                    box-shadow: none;
                    filter: drop-shadow(-${getREM(spaces[1])} -${getREM(spaces[1])} 0.313rem rgba(0,0,0,.06));
                }
                .ant-dropdown-placement-topCenter, .ant-dropdown-placement-topRight, .ant-dropdown-placement-topLeft{
                    .ant-dropdown-arrow {
                        border-top-color: ${arrowColor} ;
                        bottom: 0.18rem;
                        border-bottom: none;
                    }
                }
                .ant-dropdown-placement-bottomCenter, .ant-dropdown-placement-bottomRight, .ant-dropdown-placement-bottomLeft{
                    .ant-dropdown-arrow {
                        border-bottom-color: ${arrowColor} ;
                        top: 0.18rem;
                        border-top: none;
                    }
                }
                .ant-dropdown-placement-bottomCenter,  .ant-dropdown-placement-topCenter{
                    .ant-dropdown-arrow{
                        transform: translateX(-50%) rotate(0);
                    }
                }
                .ant-dropdown-placement-topRight, .ant-dropdown-placement-topLeft, .ant-dropdown-placement-bottomRight, .ant-dropdown-placement-bottomLeft{
                    .ant-dropdown-arrow{
                        transform: rotate(0);
                    }
                }
            `
        );
    }}
    
`;

const StyledDropdownOverlay = styledComponent.div`
    ${({ theme }) => {
        const { neutrals, secondary } = theme.colors;
        const { textColor, textColorInverse, spaces } = theme.default;

        return `
            color: ${theme.mode === ThemeMode.inDepo ? textColorInverse : textColor};
            background-color: ${theme.mode === ThemeMode.inDepo ? secondary[5] : neutrals[6]};
            border-radius: ${getREM(theme.default.borderRadiusBase)};
            overflow: hidden;
            box-shadow: ${
                theme.mode === ThemeMode.inDepo
                    ? `0 0 ${getREM(spaces[9])} 0 rgba(0, 0, 0, 0.2), 0 0 ${getREM(spaces[3])} 0 rgba(0, 0, 0, 0.08)`
                    : `0 0 ${getREM(spaces[9])} 0 ${hexToRGBA(neutrals[2], 0.2)}, 0 0 ${getREM(
                          spaces[3]
                      )} 0 ${hexToRGBA(neutrals[2], 0.08)}`
            };
            .ant-menu-item {
                padding: ${getREM(theme.default.spaces[4])} ${getREM(theme.default.spaces[6])};
                line-height: ${getREM(theme.default.spaces[9])};
                height: ${getREM(theme.default.spaces[12] + theme.default.spaces[9])};
            }
            .ant-menu .ant-menu-item-divider{
                margin: 0;
            }
        `;
    }}
`;

const Dropdown = ({ children, overlay, styled, theme, dataTestId, ...props }: IDropdownProps) => {
    return (
        <div data-testid={dataTestId}>
            <StyledPopupContainer $styled={styled} theme={theme}>
                <ANTDropdown
                    overlay={() => (
                        <>{styled ? <StyledDropdownOverlay theme={theme}>{overlay}</StyledDropdownOverlay> : overlay}</>
                    )}
                    getPopupContainer={(trigger) => trigger.parentElement}
                    {...props}
                >
                    {children}
                </ANTDropdown>
            </StyledPopupContainer>
        </div>
    );
};

export default Dropdown;
