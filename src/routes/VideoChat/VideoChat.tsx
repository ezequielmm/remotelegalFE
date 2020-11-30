import React, { useState, useCallback, useContext, useEffect } from "react";
import Lobby from "./VideoChatLobby/VideoChatLobby";
import VideoChatRoom from "./VideoChatRoom/VideoChatRoom";
import { useJoinToRoom, disconnect } from "../../hooks/VideoChat/roomHooks";
import { GlobalStateContext } from "../../state/GlobalState";

const VideoChat = () => {
    const [roomName, setRoomName] = useState("");
    const { state, dispatch } = useContext(GlobalStateContext);
    const [joinToRoom, loading, error] = useJoinToRoom();
    const { message, currentRoom } = state.room;

    useEffect(() => {
        if (message.module === "endDepo") {
            disconnect(currentRoom, dispatch);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    const handleSubmit = useCallback(
        async ({ roomName }) => {
            setRoomName(roomName);
            joinToRoom(roomName);
        },
        [joinToRoom]
    );

    if (!state.room.currentRoom && !loading)
        return <Lobby roomName={roomName} handleSubmit={handleSubmit} error={error} />;
    return <VideoChatRoom room={state.room.currentRoom} loading={loading} />;
};

export default VideoChat;
