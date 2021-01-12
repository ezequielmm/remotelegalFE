import React, { ReactElement } from "react";
import { Col, Tooltip } from "antd";
import { StyledViewDocumentHeader } from "../styles";
import Text from "../../../../../../components/Typography/Text";
import Button from "../../../../../../components/Button";
import Icon from "../../../../../../components/Icon";
import { ReactComponent as backIcon } from "../../../../../../assets/in-depo/back.svg";
import ColorStatus from "../../../../../../types/ColorStatus";

interface Props {
    fileName: string;
    onClose?: () => void;
    disabled?: boolean;
}

export default function ViewDocumentHeader({ fileName, onClose, disabled = false }: Props): ReactElement {
    return (
        <StyledViewDocumentHeader align="middle" data-testid="view-document-header">
            <Col md={6} xxl={4}>
                <Text state={ColorStatus.white}>
                    <Icon
                        data-testid="view-document-back-button"
                        icon={backIcon}
                        style={{ fontSize: "16px" }}
                        onClick={onClose}
                    />
                </Text>
            </Col>
            <Col md={12} xxl={16}>
                <Tooltip title={fileName}>
                    <Text size="large" state={ColorStatus.white} block align="center">
                        {fileName}
                    </Text>
                </Tooltip>
            </Col>
            <Col md={6} xxl={4} style={{ textAlign: "right" }}>
                <Button type="primary" size="small" data-testid="view-document-share-button" disabled={disabled}>
                    Share with all
                </Button>
            </Col>
        </StyledViewDocumentHeader>
    );
}
