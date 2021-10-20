// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Button from "@rl/prp-components-library/src/components/Button";
import Popover from "@rl/prp-components-library/src/components/Popover";
import Space from "@rl/prp-components-library/src/components/Space";
import { IPopoverProps } from "@rl/prp-components-library/src/components/Popover/Popover";
import Text from "@rl/prp-components-library/src/components/Text";
import { ContainerCentered } from "./Decorators";

const content = (
    <Space direction="vertical">
        <Text size="large" weight="bold">
            Title
        </Text>
        <Text>Description</Text>
    </Space>
);

export default {
    title: "Popover",
    component: Popover,
    argTypes: {
        placement: {
            control: {
                type: "select",
                options: [
                    "topLeft",
                    "top",
                    "topRight",
                    "leftTop",
                    "left",
                    "leftBottom",
                    "rightTop",
                    "right",
                    "rightBottom",
                    "bottomLeft",
                    "bottom",
                    "bottomRight",
                ],
            },
        },
        trigger: {
            control: {
                type: "select",
                options: ["click", "hover"],
            },
        },
        visible: { control: "boolean" },
        overlay: {
            control: null,
        },
        $hasPadding: { control: "boolean" },
    },
    decorators: [
        (Template) => (
            <ContainerCentered>
                <Template />
            </ContainerCentered>
        ),
    ],
} as Meta;

const Template: Story = (args: IPopoverProps) => {
    return (
        <Popover {...args}>
            <Button type="link">Hover me</Button>
        </Popover>
    );
};
export const PRPopover = Template.bind({});
PRPopover.args = {
    overlay: content,
    trigger: "hover",
    closable: true,
    onClose: () => alert("here"),
};
