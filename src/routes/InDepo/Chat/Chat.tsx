import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../../components/Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as SendIcon } from "../../../assets/in-depo/send.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/icons/Error.svg";
import { GlobalStateContext } from "../../../state/GlobalState";
import ChatItem from "./ChatItem";
import * as CONSTANTS from "../../../constants/inDepo";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import ColorStatus from "../../../types/ColorStatus";
import Divider from "../../../components/Divider";
import Spinner from "../../../components/Spinner";
import Space from "../../../components/Space";
import {
    StyledChatContainer,
    StyledChatBody,
    StyledCloseIcon,
    StyledMessagesContainer,
    StyledSendMessage,
    StyledInput,
    StyledSendButton,
    StyledInputWrapper,
} from "./styles";
import Button from "../../../components/Button";
import { Message } from "../../../models/general";

const ChatScreen = ({
    closePopOver,
    open,
    height = "28rem",
    messages,
    sendMessage,
    loadClient,
    loadingClient,
    errorLoadingClient,
}: {
    closePopOver: () => void;
    open: boolean;
    height?: number | string;
    sendMessage: (text: string) => void;
    loadClient: () => void;
    loadingClient: boolean;
    errorLoadingClient: boolean;
    messages: Message[];
}) => {
    const [text, setText] = useState("");
    const scrollDiv = useRef(null);
    const inputRef = useRef(null);
    const { state } = useContext(GlobalStateContext);
    const [textRows, setTextRows] = useState(1);

    const { currentRoom, timeZone } = state.room;

    const currentEmail = useMemo(() => JSON.parse(currentRoom?.localParticipant?.identity || "{}").email, [
        currentRoom,
    ]);

    const scrollToBottom = () => {
        if (scrollDiv?.current?.scrollTop !== undefined) {
            const scrollHeight = scrollDiv?.current.scrollHeight;
            const divHeight = scrollDiv?.current.clientHeight;
            const maxScrollTop = scrollHeight - divHeight;
            scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
                scrollToBottom();
            }, 10);
        }
    }, [open]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (text && String(text).trim()) {
            sendMessage(text);
            setText("");
            setTextRows(1);
        }
    };

    const handleChange = (event) => {
        const textareaLineHeight = 21;
        const minRows = 1;
        const maxRows = 4;
        const previousRows = event.target.rows;
        event.target.rows = minRows;
        const currentRows = event.target.scrollHeight / textareaLineHeight;

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
            event.target.scrollTop = event.target.scrollHeight;
        }
        setTextRows(currentRows < maxRows ? currentRows : maxRows);
        setText(event.target.value);
    };
    useEffect(() => {
        scrollToBottom();
    }, [textRows]);

    const handleInputKeyPress = (e) => {
        if (e.key?.toLocaleLowerCase() === "enter" || e.keyCode === 13) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <StyledChatContainer data-testid={CONSTANTS.CHAT_TEST_ID} hasPadding={false} height={height}>
            <StyledChatBody>
                <StyledCloseIcon
                    icon={CloseIcon}
                    onClick={closePopOver}
                    data-testid="close_chat"
                    color={ColorStatus.disabled}
                />
                <Title level={5} weight="regular" ellipsis={false} noMargin>
                    {CONSTANTS.CHAT_TITLE}
                </Title>
                <Space pt={3} fullWidth>
                    <Divider hasMargin={false} />
                </Space>
                <StyledMessagesContainer ref={scrollDiv}>
                    {loadingClient && <Spinner height="100%" />}
                    {errorLoadingClient && (
                        <Space
                            data-testid={CONSTANTS.CHAT_ERROR_TEST_ID}
                            fullHeight
                            align="center"
                            justify="center"
                            direction="vertical"
                        >
                            <Icon size="3rem" icon={ErrorIcon} color={ColorStatus.error} />
                            <Space.Item style={{ textAlign: "center" }}>
                                <Text ellipsis={false} weight="bold" size="large">
                                    {CONSTANTS.NETWORK_ERROR}
                                </Text>
                                <Text ellipsis={false}>{CONSTANTS.TRY_AGAIN}</Text>
                            </Space.Item>
                            <Button
                                type="text"
                                onClick={loadClient}
                                key="console"
                                data-testid={CONSTANTS.CHAT_TRY_AGAIN_TEST_ID}
                            >
                                {CONSTANTS.REFRESH_CHAT}
                            </Button>
                        </Space>
                    )}
                    {messages?.map((message, index) => (
                        <ChatItem
                            sameAuthor={index > 0 && message.author === messages[index - 1].author}
                            key={message.index}
                            message={message}
                            isCurrentUser={currentEmail === JSON.parse(message.author).email}
                            timeZone={timeZone}
                        />
                    ))}
                </StyledMessagesContainer>
            </StyledChatBody>
            <Divider hasMargin={false} />
            <StyledSendMessage>
                <StyledInputWrapper>
                    <StyledInput
                        data-testid={CONSTANTS.CHAT_INPUT_TEST_ID}
                        required
                        placeholder="Type message to everyone…"
                        value={text}
                        disabled={loadingClient || errorLoadingClient}
                        onChange={(event) => handleChange(event)}
                        onKeyDown={(event) => handleInputKeyPress(event)}
                        ref={inputRef}
                        rows={textRows}
                    />
                </StyledInputWrapper>
                <StyledSendButton
                    data-testid={CONSTANTS.CHAT_INPUT_BUTTON_TEST_ID}
                    onClick={handleSendMessage}
                    disabled={loadingClient || errorLoadingClient || !text}
                    type="link"
                >
                    <Icon size={9} icon={SendIcon} />
                </StyledSendButton>
            </StyledSendMessage>
        </StyledChatContainer>
    );
};

export default ChatScreen;
