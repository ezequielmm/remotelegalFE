import React from "react";
import { DatePicker } from "antd";
import { DatePickerProps } from "antd/lib/date-picker";
import styled from "styled-components";
import { getREM, hexToRGBA, getWeightNumber } from "../../constants/styles/utils";
import Icon from "../Icon";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import PopupContainer from "../PopupContainer";
import { IPopupContainer } from "../PopupContainer/PopupContainer";

export type IDatePickerProps = DatePickerProps & {
    invalid?: boolean;
};

const StyledDatePicker = styled(DatePicker).attrs((props: IDatePickerProps) => ({
    invalid: props.invalid ? "true" : undefined,
}))<IDatePickerProps>`
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
    width: 100%;
    ${({ theme }) => {
        const { neutrals } = theme.colors;
        const styles = `
            .ant-picker-panel-container {
                box-shadow: 0 12px 24px 0 ${hexToRGBA(neutrals[2], 0.08)};
                .ant-picker-body {
                    .ant-picker-content {
                        thead th {
                            font-weight: ${getWeightNumber("bold")};
                        }
                        .ant-picker-cell .ant-picker-cell-inner {
                            border-radius: 2px;
                        }
                        .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
                            border-radius: 2px;
                        }
                    }
                }
            }
        `;
        return styles;
    }}
`;

const datepicker = ({ ...props }: IDatePickerProps) => (
    <StyledPopupContainer>
        <StyledDatePicker
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon size={9} icon={CalendarIcon} />}
        />
    </StyledPopupContainer>
);
export default datepicker;
