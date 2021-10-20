import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Radio from "@rl/prp-components-library/src/components/Radio";
import RadioGroup from "@rl/prp-components-library/src/components/RadioGroup";

export default {
    title: "Radio",
    component: Radio,
} as Meta;

const Template: Story = () => {
    const [value, setValue] = React.useState(1);

    const onChange = (e) => {
        console.log("radio checked", e.target.value);
        setValue(e.target.value);
    };
    return (
        <RadioGroup onChange={onChange} value={value}>
            <Radio value={1}>YES</Radio>
            <Radio value={2}>NO</Radio>
        </RadioGroup>
    );
};

export const StyledRadio = Template.bind({});
