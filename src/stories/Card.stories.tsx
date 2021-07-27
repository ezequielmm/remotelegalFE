// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Button from "prp-components-library/src/components/Button";
import CardComponent from "prp-components-library/src/components/Card";
import Icon from "prp-components-library/src/components/Icon";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import ColorStatus from "../types/ColorStatus";
import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";

export default {
    title: "Card",
    component: CardComponent,
    argTypes: {
        bg: {
            control: {
                type: "select",
                options: ColorStatus,
            },
        },
    },
} as Meta;

const Template: Story = (args) => {
    return (
        <CardComponent {...args}>
            <Title level={5}>Card Title</Title>
            <Text>To select or add a case please complete the information below.</Text>
        </CardComponent>
    );
};

export const Card = Template.bind({});

export const CardWithAction = Template.bind({});
CardWithAction.args = {
    extra: (
        <Button icon={<Icon icon={EditIcon} />} type="link">
            EDIT
        </Button>
    ),
};
