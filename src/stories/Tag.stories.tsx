import { Story, Meta } from "@storybook/react/types-6-0";
import Tag from "prp-components-library/src/components/Tag";

import ColorStatus from "../types/ColorStatus";

export default {
    title: "Tag",
    component: Tag,
    argTypes: {
        text: {
            control: {
                type: "text",
            },
        },
        pill: {
            control: {
                type: "boolean",
            },
        },
        color: {
            control: {
                type: "select",
                options: Object.values(ColorStatus),
            },
        },
    },
} as Meta;

const Template: Story = ({ text, ...args }) => <Tag {...args}>{text}</Tag>;

export const PRTag = Template.bind({});
PRTag.args = {
    text: "Tag Text",
    pill: false,
};
