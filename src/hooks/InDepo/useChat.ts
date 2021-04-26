import { Client } from "@twilio/conversations";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useChat = ({ chatOpen, disableChat, setUnreadedChats, unreadedChats }): any => {
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState(null);
    const [conversationsClient, setConversationsClient] = useState<Client>(null);
    const { state } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();

    const { currentRoom, token } = state.room;
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const [loadClient, loadingClient, errorLoadingClient] = useAsyncCallback(async () => {
        const newConversationsClient = await Client.create(token);
        const newConversation = await newConversationsClient.getConversationByUniqueName(depositionID);
        const newMessages = (await newConversation.getMessages()).items;
        if (isMounted.current) {
            setConversation(newConversation);
            setConversationsClient(newConversationsClient);
            setMessages(newMessages);
        }
    }, []);

    useEffect(() => {
        if (chatOpen) {
            setUnreadedChats(0);
        }
    }, [chatOpen, setUnreadedChats]);

    useEffect(() => {
        let handleMessageAdded;
        if (conversationsClient) {
            handleMessageAdded = (message) => {
                setMessages([...messages, message]);
                if (!chatOpen) setUnreadedChats(unreadedChats + 1);
            };
            conversationsClient.on("messageAdded", handleMessageAdded);
        }
        return () => {
            if (handleMessageAdded) conversationsClient.off("messageAdded", handleMessageAdded);
        };
    }, [messages, conversationsClient, setUnreadedChats, unreadedChats, chatOpen]);

    useEffect(() => {
        if (!token || disableChat || !isMounted.current) return;
        loadClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleFailSendMessage = (failedText) => {
        setMessages([
            ...messages,
            {
                author: currentRoom?.localParticipant?.identity,
                body: failedText,
                failed: true,
                index: `failed-${messages.length}`,
            },
        ]);
    };

    const sendMessage = (text) => {
        if (conversation) {
            conversation.sendMessage(text).catch(() => handleFailSendMessage(text));
        }
    };

    return { messages, setMessages, sendMessage, loadClient, loadingClient, errorLoadingClient };
};

export default useChat;
