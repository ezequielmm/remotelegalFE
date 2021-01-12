import React from "react";
import Text from "../Typography/Text";
import useShowTime from "../../hooks/useShowTime";
import { TimeZones } from "../../models/general";
import ColorStatus from "../../types/ColorStatus";

const SECOND = 1000;

export default function Clock({ timeZone }: { timeZone?: TimeZones }) {
    const time = useShowTime({ timeZone, updateInterval: SECOND });

    return (
        <Text data-testid="participant_time" size="default" weight="bold" state={ColorStatus.white}>
            {time && `${time} (${String(timeZone)})`}
        </Text>
    );
}
