import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Message from "../components/Message";

export default ({
    title: "Message",
    component: Message,
    argTypes: {
        type: {
            control: {
                type: "select",
                options: ["info", "success", "error", "warning", "loading"],
            },
        },
        content: { control: "text" },
        duration: { control: "number", min: 1, max: 20, step: 0.5 },
    },
} as unknown) as Meta;

const Template: Story = (args) => {
    const successMessage = () => {
        Message({
            type: args.type,
            content: args.content,
            duration: args.duration,
        });
    };

    return (
        <div style={{ backgroundColor: "#F2F5F7", padding: "32px" }}>
            <button onClick={() => successMessage()}>Show Message</button>
        </div>
    );
};

export const StyledMessage = Template.bind({});
StyledMessage.args = {
    type: "success",
    content: "Success Message",
    duration: 1.5,
};
