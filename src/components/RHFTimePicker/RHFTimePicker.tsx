import React from "react";
import styled from "styled-components";
import RHFWrapper from "../RHFWrapper";
import TimePicker from "../TimePicker";
import Button from "../Button";
import { RHFWrapperProps } from "../RHFWrapper/RHFWrapper";
import { TimePickerProps } from "../GenerateDatePicker/interfaces/interfaces";

interface RHFTimePickerProps extends RHFWrapperProps {
    placeholder?: string;
    timePickerProps?: TimePickerProps;
    extraFooterText?: string;
    dataTestId?: string;
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
    dataTestId,
    ...wrapperProps
}: RHFTimePickerProps) {
    return (
        <RHFWrapper
            component={({ name: inputName, onChange, onBlur, value }) => (
                <TimePicker
                    defaultValue={wrapperProps.defaultValue}
                    placeholder={placeholder}
                    name={inputName}
                    data-testid={dataTestId}
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
