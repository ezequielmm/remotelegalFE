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
        const { secondary, neutrals } = theme.colors;
        const { spaces } = theme.default;

        return (
            $styled &&
            `
                .ant-dropdown-arrow {
                    border-color: ${theme.mode === ThemeMode.inDepo ? secondary[5] : neutrals[6]};
                    width: ${spaces[4]};
                    height: ${spaces[4]};
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
                padding: ${getREM(theme.default.spaces[2])} ${getREM(theme.default.spaces[6])};
                line-height: ${getREM(theme.default.spaces[9])};
                &:first-child {
                    padding-top: ${getREM(theme.default.spaces[6])};
                }
                &:last-child {
                    padding-bottom: ${getREM(theme.default.spaces[6])};
                }
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
                        <>
                            {styled ? (
                                <StyledDropdownOverlay theme={theme}>{overlay}</StyledDropdownOverlay>
                            ) : (
                                { overlay }
                            )}
                        </>
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
