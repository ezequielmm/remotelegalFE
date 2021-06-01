/* eslint-disable no-nested-ternary */
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import Space from "../../../../components/Space";
import Text from "../../../../components/Typography/Text";
import ColorStatus from "../../../../types/ColorStatus";
import { ReactComponent as InfoIcon } from "../../../../assets/icons/information.filled.svg";
import Icon from "../../../../components/Icon";
import { StyledItem, StyledText, StyledBubble } from "./styles";
import { mapTimeZone, Message, TimeZones } from "../../../../models/general";
import * as CONSTANTS from "../../../../constants/inDepo";

dayjs.extend(utc);
dayjs.extend(timezone);

const ChatItem = ({
    message,
    isCurrentUser,
    sameAuthor,
    timeZone,
}: {
    message: Message;
    isCurrentUser: boolean;
    sameAuthor: boolean;
    timeZone?: TimeZones;
}) => {
    return (
        <StyledItem isCurrentUser={isCurrentUser} isSameAuthor={sameAuthor}>
            <Space direction="vertical" size={2} align={isCurrentUser ? "flex-end" : "flex-start"} fullWidth>
                {!sameAuthor && (
                    <Space
                        data-testid={
                            isCurrentUser
                                ? CONSTANTS.CURRENT_USER_CHAT_MESSAGE_TIME_TEST_ID
                                : CONSTANTS.CHAT_MESSAGE_TIME_TEST_ID
                        }
                        size={2}
                    >
                        <StyledText size="small" color={ColorStatus.disabled}>
                            {isCurrentUser ? "You" : JSON.parse(message.author).name}
                        </StyledText>
                        <StyledText size="small" color={ColorStatus.disabled} weight="light">
                            {dayjs(message.dateCreated).tz(mapTimeZone[timeZone]).format("hh:mm A")}
                        </StyledText>
                    </Space>
                )}
                <StyledBubble
                    data-testid={
                        isCurrentUser ? CONSTANTS.CURRENT_USER_CHAT_MESSAGE_TEST_ID : CONSTANTS.CHAT_MESSAGE_TEST_ID
                    }
                    failed={message.failed}
                    isCurrentUser={isCurrentUser}
                >
                    {message.body}
                </StyledBubble>
                {message.failed && (
                    <Space align="center" size={2}>
                        <Icon size={6} icon={InfoIcon} color={ColorStatus.error} />
                        <Text
                            data-testid={CONSTANTS.COULDNT_SEND_MESSAGE_TEST_ID}
                            size="small"
                            state={ColorStatus.error}
                        >
                            {CONSTANTS.COULDNT_SEND_MESSAGE}
                        </Text>
                    </Space>
                )}
            </Space>
        </StyledItem>
    );
};

export default ChatItem;
