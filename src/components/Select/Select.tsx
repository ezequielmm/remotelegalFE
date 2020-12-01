import React from "react";
import { Select as ANTSelect } from "antd";
import { SelectProps } from "antd/lib/select";
import styled from "styled-components";
import { getPX, getREM } from "../../constants/styles/utils";
import { ReactComponent as DropdownArrowIcon } from "../../assets/icons/dropdown-arrow.svg";
import Icon from "../Icon";

export interface ISelectProps extends SelectProps<any> {
    invalid?: boolean;
}

export const StyledSelect = styled(ANTSelect).attrs((props: ISelectProps) => ({
    invalid: props.invalid ? "true" : undefined,
}))<ISelectProps>`
    ${({ size, invalid, theme }) => {
        const { inputHeightBase, disabledColor, errorColor } = theme.default;

        // TODO add switch of sizes
        const maxHeight = size === undefined || size === "middle" ? getREM(inputHeightBase) : "unset";

        const sizeStyles = `
                max-height: ${maxHeight};
            `;

        const invalidStyles = `
                border-color: ${errorColor};
                box-shadow: 0 0 0 2px rgba(189, 36, 20, 0.2);
            `;

        // TODO add missing spaces token
        const styles = `
            ${sizeStyles};
            width: 100%;

            .ant-select-selection-placeholder {
                color: ${disabledColor};
            }

            &.ant-select {
                .ant-select-selector {
                    ${invalid ? invalidStyles : ""};
                }
            }

            .ant-select-arrow {
                font-size: ${getREM(theme.default.spaces[5])};
                top: calc(50% - ${getREM(theme.default.spaces[5])} / 2);
                width: ${getREM(theme.default.spaces[5])};
                height: ${getREM(theme.default.spaces[5])};
                margin-top: 0;
                .anticon {
                    pointer-events: none;
                }
            }

            .ant-select-clear {
                box-shadow: -5px 0 10px 10px ${theme.default.whiteColor};
                right: ${getPX(theme.default.spaces[3])};
            }

            .ant-select-dropdown {
                padding: ${getPX(theme.default.borderRadiusBase)} 0;
            }

            .ant-select-item {
                padding: 12px;
            }

            .rc-virtual-list-holder {
                scrollbar-color: ${theme.colors.inDepoBlue[6]} ${theme.default.whiteColor};

                &::-webkit-scrollbar {
                    width: ${getPX(theme.default.spaces[1])};
                }
                &::-webkit-scrollbar-track {
                    background-color: ${theme.default.whiteColor};
                }
                &::-webkit-scrollbar-thumb {
                    border-radius: ${getPX(theme.default.spaces[5])};
                    background: ${theme.colors.inDepoBlue[6]};
                }
            }

            .rc-virtual-list-scrollbar-thumb {
                background: ${theme.colors.inDepoBlue[6]} !important;
            }
            `;

        return styles;
    }}
`;

export const { Option } = ANTSelect;

export const Select = ({ children, ...props }: ISelectProps) => (
    <StyledSelect
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        suffixIcon={<Icon icon={DropdownArrowIcon} />}
        getPopupContainer={(trigger) => trigger.parentElement}
    >
        {children}
    </StyledSelect>
);
