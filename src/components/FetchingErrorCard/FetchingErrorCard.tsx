import React from "react";
import styled from "styled-components";
import { Button, Image } from "antd";
import Title from "../Typography/Title";
import Text from "../Typography/Text";
import { FETCH_ERROR_MODAL_TITLE, FETCH_ERROR_MODAL_BODY, FETCH_ERROR_MODAL_BUTTON } from "./constants";

const WarningImage = require("../../assets/icons/warning.svg");

interface FetchingErrorCardProps {
    refreshPage: () => void;
}

const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 700px;
    height: 500px;
    border-radius: 12px;
    background-color: #ffffff;
    padding: 70px;
`;

export default function FetchingErrorCard({ refreshPage }: FetchingErrorCardProps) {
    return (
        <Card>
            <Image src={WarningImage} alt="Error Loading Items" />
            <Title level={3} weight="light" noMargin>
                {FETCH_ERROR_MODAL_TITLE}
            </Title>
            <Text>{FETCH_ERROR_MODAL_BODY}</Text>
            <Button type="primary" key="console" onClick={() => refreshPage()}>
                {FETCH_ERROR_MODAL_BUTTON}
            </Button>
        </Card>
    );
}
