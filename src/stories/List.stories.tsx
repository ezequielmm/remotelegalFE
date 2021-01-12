import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { Row } from "antd";
import Text from "../components/Typography/Text";
import List from "../components/List";
import Card from "../components/Card";
import { ContainerSmall } from "./Decorators";
import Button from "../components/Button";
import ColorStatus from "../types/ColorStatus";

export default {
    title: "List",
    component: List,
    argTypes: {
        size: {
            control: {
                type: "select",
                options: ["default", "large", "small"],
            },
        },
    },
    decorators: [
        (Template) => (
            <ContainerSmall>
                <Template />
            </ContainerSmall>
        ),
    ],
} as Meta;

const Template: Story = (args) => <List {...args} />;

export const PRList = Template.bind({});
PRList.args = {
    dataSource: ["top", "middle", "bottom"],
};

export const PRListCard = (args) => (
    <Card>
        <List {...args} />
    </Card>
);
PRListCard.args = {
    ...PRList.args,
};

export const PRListCustomItem = Template.bind({});
PRListCustomItem.args = {
    dataSource: ["A", "B", "C"],
    renderItem: (item) => {
        return (
            <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                <div>
                    <Text block state={ColorStatus.primary}>
                        {`Item ${item}`}
                    </Text>
                </div>
                <Button type="link">Action</Button>
            </Row>
        );
    },
    size: "large",
};
