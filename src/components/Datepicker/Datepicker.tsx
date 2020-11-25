import React from "react";
import { DatePicker } from "antd";
import { DatePickerProps } from "antd/lib/date-picker";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
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

        // TODO add color token to box shadow properties
        const invalidStyles = `
                border-color: ${errorColor};
                box-shadow: 0 0 0 2px rgba(189, 36, 20, 0.2);
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
    // TODO add color token to box shadow properties
    .ant-picker-panel-container {
        box-shadow: 0 12px 24px 0 rgba(162, 195, 216, 0.08);
        .ant-picker-body {
            .ant-picker-content {
                thead th {
                    font-weight: bold;
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

const datepicker = ({ ...props }: IDatePickerProps) => (
    <StyledPopupContainer>
        <StyledDatePicker
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
            getPopupContainer={(trigger) => trigger.parentElement}
            suffixIcon={<Icon style={{ fontSize: "24px" }} icon={CalendarIcon} />}
        />
    </StyledPopupContainer>
);
export default datepicker;
