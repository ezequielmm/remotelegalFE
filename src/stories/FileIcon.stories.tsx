import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import FileIcon from "prp-components-library/src/components/FileIcon";
import { IFileIconProps } from "prp-components-library/src/components/FileIcon/FileIcon";
import { ContainerSmall } from "./Decorators";
import FileTypes from "../types/FileTypes";

export default {
    title: "FileIcon",
    component: FileIcon,
    argTypes: {
        type: {
            control: {
                type: "select",
                options: Object.keys(FileTypes),
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

const Template: Story = (args: IFileIconProps) => <FileIcon {...args} />;

export const PRFileIcon = Template.bind({});
PRFileIcon.args = {
    type: FileTypes.pdf,
};
