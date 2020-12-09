import React from "react";
import styled from "styled-components";
import { Radio } from "antd";
import { RadioGroupProps } from "antd/lib/radio";

const StyledRadioGroup = styled(Radio.Group)`
    display: flex;
    align-items: center;
`;

const RadioGroup = (props: RadioGroupProps) => <StyledRadioGroup {...props} />;

export default RadioGroup;
