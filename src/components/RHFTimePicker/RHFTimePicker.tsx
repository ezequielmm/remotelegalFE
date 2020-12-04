import { TimePickerProps } from "antd/lib/time-picker";
import React from "react";
import RHFWrapper from "../RHFWrapper";
import TimePicker from "../TimePicker";
import Button from "../Button";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import moment from "moment";
import styled from "styled-components";

interface RHFTimePickerProps extends RHFWrapperProps {
    placeholder?: string;
    timePickerProps?: TimePickerProps;
    extraFooterText?: string;
    handleExtraFooterClick?: (onChange: (...event: any[]) => void, value: string) => void;
}

const FooterTextContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export default function RHFTimePicker({
    extraFooterText,
    handleExtraFooterClick,
    timePickerProps,
    placeholder,
    ...wrapperProps
}: RHFTimePickerProps) {
    return (
        <RHFWrapper
            component={({ name: inputName, onChange, onBlur, value }) => (
                <TimePicker
                    defaultValue={moment(wrapperProps.defaultValue)}
                    placeholder={placeholder}
                    name={inputName}
                    onBlur={onBlur}
                    onChange={(ev) => onChange(ev)}
                    value={value}
                    renderExtraFooter={() =>
                        extraFooterText && (
                            <FooterTextContainer>
                                <Button type="link" onClick={() => handleExtraFooterClick(onChange, value)}>
                                    {extraFooterText}
                                </Button>
                            </FooterTextContainer>
                        )
                    }
                    invalid={!!wrapperProps.errorMessage}
                    {...timePickerProps}
                />
            )}
            {...wrapperProps}
        />
    );
}
