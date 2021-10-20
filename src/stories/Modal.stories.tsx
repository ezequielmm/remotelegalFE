import React from "react";

import { Story, Meta } from "@storybook/react/types-6-0";
import Button from "@rl/prp-components-library/src/components/Button";
import Modal from "@rl/prp-components-library/src/components/Modal";
import Result from "@rl/prp-components-library/src/components/Result";

export default {
    title: "Modal",
    component: Modal,
    argTypes: {
        visible: {
            control: {
                type: "boolean",
            },
        },
    },
} as Meta;

const Template: Story = ({ title, content, ...rest }) => (
    <Modal onlyBody destroyOnClose {...rest}>
        <Result
            title="Modal Title"
            subTitle="content lorem ipsum dolor sit amet"
            extra={[<Button type="primary">Primary Action</Button>]}
        />
    </Modal>
);
export const PRModal = Template.bind({});
PRModal.args = {
    visible: true,
};
