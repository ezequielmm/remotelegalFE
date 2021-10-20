// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Title from "@rl/prp-components-library/src/components/Title";

export default {
    title: "Title",
    component: Title,
    argTypes: {
        level: {
            control: {
                type: "select",
                options: [1, 2, 3, 4, 5, 6],
            },
        },
        weight: {
            control: {
                type: "select",
                options: ["light", "regular", "bold"],
            },
        },
        ellipsis: { control: "boolean" },
        noMargin: { control: "boolean" },
        children: { control: "text" },
    },
} as Meta;

const Template: Story = (args) => <Title {...args}>{args.children}</Title>;

export const PRTitle = Template.bind({});
PRTitle.args = {
    level: 1,
    weight: "bold",
    ellipsis: true,
    noMargin: false,
    children: "Merriweather example title",
};
