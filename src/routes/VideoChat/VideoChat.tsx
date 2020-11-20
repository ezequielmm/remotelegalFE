import React, { useState, useCallback } from "react";
import Lobby from "./VideoChatLobby";
import VideoChatRoom from "./VideoChatRoom";
import useVideoChat from "../../hooks/useVideoChat";

const VideoChat = () => {
    const [roomName, setRoomName] = useState("");
    const { token, room, joinToRoom, connected, disconnect, error } = useVideoChat();

    const handleSubmit = useCallback(
        async ({ roomName }) => {
            setRoomName(roomName);
            joinToRoom(roomName);
        },
        [joinToRoom]
    );

    if (!token) return <Lobby roomName={roomName} handleSubmit={handleSubmit} error={error} />;
    return (
        <VideoChatRoom
            room={room.currentRoom}
            connected={connected}
            handleLogout={() => disconnect(room.currentRoom)}
        />
    );
};

export default VideoChat;
