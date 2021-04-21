import styled from "styled-components";
import { DatePicker as AntDatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";
import { IDatePickerProps } from "./DatePicker";
import PopupContainer from "../PopupContainer";
import { IPopupContainer } from "../PopupContainer/PopupContainer";
import { getREM, hexToRGBA, getWeightNumber } from "../../constants/styles/utils";

export const StyledDatePicker = styled(AntDatePicker).attrs((props: IDatePickerProps) => ({
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

export const StyledRangePicker = styled(StyledDatePicker)<RangePickerProps>``;

export const StyledPopupContainer = styled(PopupContainer)<IPopupContainer>`
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
