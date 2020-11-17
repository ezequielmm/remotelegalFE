import React from "react";
import { Form, Input } from "antd";
import Button from "../../../components/Button";
import styled from "styled-components";
import Title from "../../../components/Typography/Title";

const VideoChatLobby = ({ roomName, handleSubmit, error }) => {
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
    };

    const StyledForm = styled.div`
        border: solid 1px #eee;
        padding: 30px;
        margin: 20px auto;
        width: 600px;
        height: 350px;
    `;

    return (
        <StyledForm>
            <Form
                {...layout}
                layout="horizontal"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
            >
                <Title level={3} weight="light" noMargin>
                    Video Chat
                </Title>

                <Form.Item label="Room name" name="roomName">
                    <Input value={roomName} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Join to room
                    </Button>
                </Form.Item>
                <div>{error}</div>
            </Form>
        </StyledForm>
    );
};

export default VideoChatLobby;
