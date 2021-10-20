// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import Card from "@rl/prp-components-library/src/components/Card";
import Result from "@rl/prp-components-library/src/components/Result";
import Title from "@rl/prp-components-library/src/components/Title";
import { ContainerMedium } from "./Decorators";

export default {
    title: "Result",
    component: Result,
    argTypes: {
        status: {
            control: {
                type: "select",
                options: ["empty"],
            },
        },
        title: { control: "text" },
        subTitle: { control: "text" },
    },
    decorators: [
        (Template) => (
            <ContainerMedium>
                <Template />
            </ContainerMedium>
        ),
    ],
} as Meta;

const Template: Story = (args) => {
    return (
        <Card>
            <Result
                {...args}
                extra={
                    <Title level={6} weight="light">
                        Extra: You can add whatever you want here
                    </Title>
                }
            />
        </Card>
    );
};

export const PRResult = Template.bind({});
PRResult.args = {
    status: "empty",
    title: "Empty State",
    subTitle: "This is a subtitle example",
};
