import React from "react";
import { TimePicker as ANTTimePicker } from "antd";
import { TimePickerProps } from "antd/lib/time-picker";
import styled from "styled-components";
import { getPX, getREM, hexToRGBA } from "../../constants/styles/utils";
import Icon from "../Icon";
import { ReactComponent as TimeIcon } from "../../assets/icons/time.svg";
import PopupContainer from "../PopupContainer";
import { IPopupContainer } from "../PopupContainer/PopupContainer";

export type ITimePickerProps = TimePickerProps & {
    invalid?: boolean;
};

export const StyledTimePicker = styled(ANTTimePicker).attrs((props: ITimePickerProps) => ({
    invalid: props.invalid ? "true" : undefined,
}))<ITimePickerProps>`
    ${({ size, invalid, theme }) => {
        const { inputHeightBase, disabledColor, errorColor } = theme.default;

        // TODO add switch of sizes
        const maxHeight = size === undefined || size === "middle" ? getREM(inputHeightBase) : "unset";

        const sizeStyles = `
                max-height: ${maxHeight};
            `;

        const invalidStyles = `
                border-color: ${errorColor};
                box-shadow: 0 0 0 2px ${hexToRGBA(errorColor, 0.2)};
            `;

        const styles = `
            ${sizeStyles};
            ${invalid ? invalidStyles : ""};
            line-height: 1.3;
            width: 100%;

            .ant-picker-input {
                & > input {
                    border-radius: 0;
                }
                & > input::placeholder {
                    color: ${disabledColor};
                    line-height: 1.3;
                }
            }
            .ant-picker-clear {
              box-shadow: -5px 0 10px 10px ${theme.default.whiteColor};
            }
            `;

        return styles;
    }}
`;

const StyledPopupContainer = styled(PopupContainer)<IPopupContainer>`
    ${({ theme }) => {
        return `
        width: 100%;
        .ant-picker-dropdown {
            .ant-picker-panel {
                & > .ant-picker-time-panel {
                    padding-top: 9px;

                    .ant-picker-time-panel-column {
                        scrollbar-color: ${theme.colors.inDepoBlue[6]} ${theme.default.whiteColor};

                        &::-webkit-scrollbar {
                            width: ${getPX(theme.default.spaces[3])};
                        }

                        &::-webkit-scrollbar-track {
                            background-color: ${theme.default.whiteColor};
                        }
                        &::-webkit-scrollbar-thumb {
                            border-radius: ${getPX(theme.default.spaces[9])};

                            background: ${theme.colors.inDepoBlue[6]};
                        }
                        .ant-picker-time-panel-cell-inner {
                            &:hover {
                                background: ${theme.colors.neutrals[3]};
                            }
                        }
                        & > li.ant-picker-time-panel-cell-selected {
                            .ant-picker-time-panel-cell-inner {
                                color: ${theme.default.whiteColor};
                                &:hover {
                                    background: ${theme.colors.primary[4]};
                                }
                            }
                        }
                    }
                }
                .ant-picker-footer {
                    & > .ant-picker-ranges {
                        .ant-picker-ok {
                            .ant-btn {
                                padding: 0;
                                background: none;
                                box-shadow: none;
                                border: none;
                                text-transform: uppercase;
                                text-shadow: none;
                                &:not(:disabled) {
                                    color: ${theme.default.primaryColor};
                                    &:hover {
                                        color: ${theme.colors.primary[4]};
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
    }}
`;

const TimePicker = (props: ITimePickerProps) => (
    <StyledPopupContainer>
        <StyledTimePicker
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon icon={TimeIcon} size={9} />}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    </StyledPopupContainer>
);

export default TimePicker;
