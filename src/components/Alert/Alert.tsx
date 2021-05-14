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
    id?: string;
}

const Alert = ({ showIcon = true, duration, closable = false, onClose, ...rest }: IAlertProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [classList, setClassList] = useState("");
    const timeOut = duration * 1000;
    let hasCloseIcon;
    if (closable) {
        hasCloseIcon = <Icon icon={closeIcon} size={9} />;
    }
    useEffect(() => {
        const handleClose = () => {
            setClassList("ant-alert-motion-leave ant-alert-motion-leave-active ant-alert-motion");
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
            }, 300);
            return () => clearTimeout(timer);
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
            <StyledAlert
                className={classList}
                onClose={onClose}
                closable={closable}
                closeText={hasCloseIcon}
                showIcon={showIcon}
                {...rest}
            />
        )
    );
};

export default Alert;
