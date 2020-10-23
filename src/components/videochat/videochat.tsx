import React, { useState, useCallback } from "react";
import { Button } from "antd";
import Lobby from "./videochatlobby";
import VideoChatRoom from "./videochatroom";
import useVideoChat from "../../hooks/useVideoChat";
import styled from "styled-components";

const VideoChat = () => {
    const [username, setUsername] = useState("");
    const [roomName, setRoomName] = useState("");
    const { token, room, generateToken, createRoom, joinToRoom, disconnect } = useVideoChat();

    const StyledButtonContainer = styled.div`
        margin: 20px auto;
        text-align: center;
        width: 100%;
    `;

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

    let VideoChatRender;
    if (token) {
        VideoChatRender = (
            <div>
                {Boolean(!room.currentRoom) && (
                    <StyledButtonContainer>
                        <Button onClick={(ev) => joinToRoom(token, roomName)}>Join to Room {roomName}</Button>
                    </StyledButtonContainer>
                )}
                {room.currentRoom && room.currentRoom.state && (
                    <VideoChatRoom room={room.currentRoom} handleLogout={(ev) => disconnect(room.currentRoom)} />
                )}
            </div>
        );
    } else {
        VideoChatRender = (
            <>
                <Lobby username={username} roomName={roomName} handleSubmit={handleSubmit} />
            </>
        );
    }
    return VideoChatRender;
};

export default VideoChat;
