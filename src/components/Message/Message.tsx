import React from "react";
import { message as ANTDMessage } from "antd";
import { ArgsProps } from "antd/lib/message";
import { MessageFilled } from "@ant-design/icons";

enum Notice {
    "info",
    "success",
    "error",
    "warning",
    "loading",
}

type TNoticeType = keyof typeof Notice;

export interface IMessageProps extends Omit<ArgsProps, "type, content"> {
    type: TNoticeType;
    content: string;
}

function isNoticeType(type: string): type is TNoticeType {
    return Object.values(Notice).includes(type);
}

const Message = ({ type, icon, content, ...rest }: IMessageProps) => {
    const defaultType = !isNoticeType(type) ? "info" : type;
    const defaultIcon = !isNoticeType(type) ? <MessageFilled /> : icon;

    return ANTDMessage.open({
        type: defaultType,
        icon: defaultIcon,
        content: content,
        ...rest,
    });
};

export default Message;
