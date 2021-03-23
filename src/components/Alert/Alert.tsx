import { AlertProps } from "antd/lib/alert";
import React, { useEffect, useState } from "react";
import StyledAlert from "./styles";
import Icon from "../Icon";
import { ReactComponent as closeIcon } from "../../assets/icons/close.svg";

export interface IAlertProps extends AlertProps {
    float?: boolean;
    duration?: number;
    fullWidth?: boolean;
    onClose?: () => void;
}

const Alert = ({ showIcon = true, duration, closable = false, onClose, ...rest }: IAlertProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const timeOut = duration * 1000;
    let hasCloseIcon;
    if (closable) {
        hasCloseIcon = <Icon icon={closeIcon} size={9} />;
    }
    useEffect(() => {
        const handleClose = () => {
            setIsVisible(false);
            if (onClose) {
                onClose();
            }
        };
        if (duration) {
            const timer = setTimeout(() => {
                handleClose();
            }, timeOut);
            return () => clearTimeout(timer);
        }
    }, [timeOut, duration, onClose]);
    return (
        isVisible && (
            <StyledAlert onClose={onClose} closable={closable} closeText={hasCloseIcon} showIcon={showIcon} {...rest} />
        )
    );
};

export default Alert;
