import React from "react";

interface IDurationProps {
    className?: string;
    seconds?: number;
}

const pad = (string) => {
    return ("0" + string).slice(-2);
};

const format = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
};

const Duration = ({ className, seconds }: IDurationProps) => {
    return (
        <time dateTime={`P${Math.round(seconds)}S`} className={className}>
            {format(seconds)}
        </time>
    );
};

export default Duration;
