import React, { useState, useCallback } from "react";
import { Button } from "antd";
import Lobby from "../VideoChatLobby/VideoChatLobby";
import VideoChatRoom from "../VideoChatRoom/VideoChatRoom";
import useVideoChat from "../../../hooks/useVideoChat";

const VideoChat = () => {
    const [username, setUsername] = useState("");
    const [roomName, setRoomName] = useState("");
    const { token, room, generateToken, createRoom, joinToRoom, disconnect } = useVideoChat();

    const handleSubmit = useCallback(
        async ({ roomName, name }) => {
            setRoomName(roomName);
            setUsername(name);
            const roomCreated = await createRoom(roomName);
            if (roomCreated) {
                await generateToken(roomName);
            }
        },
        [createRoom, generateToken]
    );

    if (!token) return <Lobby username={username} roomName={roomName} handleSubmit={handleSubmit} />;
    if (!room.currentRoom || !room.currentRoom.state)
        return <Button onClick={(ev) => joinToRoom(token, roomName)}>Join to Room {roomName}</Button>;

    return <VideoChatRoom room={room.currentRoom} handleLogout={() => disconnect(room.currentRoom)} />;
};

export default VideoChat;
