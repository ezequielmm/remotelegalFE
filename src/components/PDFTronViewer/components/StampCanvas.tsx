import React, { MutableRefObject, useEffect, useRef } from "react";
import moment from "moment-timezone";
import styled from "styled-components";
import { TimeZones, mapTimeZone } from "../../../models/general";
import { theme } from "../../../constants/styles/theme";
import { getREM, roundRect } from "../../../constants/styles/utils";

interface IStampCanvasProps {
    title?: string;
    timeZone: TimeZones;
    getRef?: (val: MutableRefObject<HTMLCanvasElement>) => void;
}
const StyledCanvasWrapper = styled.div`
    padding: ${getREM(theme.default.spaces[12])};
    background: ${theme.default.disabledBg};
    canvas {
        width: 100%;
        overflow: hidden;
        border-radius: ${getREM(theme.default.borderRadiusBase)};
    }
`;
const StampCanvas = ({ title = "", timeZone, getRef }: IStampCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const draw = (ctx: CanvasRenderingContext2D, firstText: string, secondText: string) => {
        const { inDepoNeutrals } = theme.colors;
        const { fontSizes, fontFamily, headerFontFamily, baseUnit, whiteColor } = theme.default;
        const background = inDepoNeutrals[6];
        const firstTextSize = fontSizes[3] * baseUnit;
        const secondTextSize = fontSizes[4] * baseUnit;
        ctx.fillStyle = background;
        roundRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height, 12 * 2, true);
        ctx.font = ` bold ${firstTextSize * 2}px ${headerFontFamily}`;
        ctx.fillStyle = whiteColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
            firstText,
            ctx.canvas.width / 2,
            ctx.canvas.height / 2 - ((firstTextSize + secondTextSize) * 2) / 3
        );
        ctx.font = `normal ${secondTextSize * 2}px ${fontFamily}`;
        ctx.fillText(
            secondText,
            ctx.canvas.width / 2,
            ctx.canvas.height / 2 + ((firstTextSize + secondTextSize) * 2) / 3
        );
    };
    useEffect(() => {
        getRef(canvasRef);
    }, [canvasRef, getRef]);
    useEffect(() => {
        const canvas = canvasRef?.current;
        const context = canvas?.getContext("2d");
        const timeStamp = moment().tz(mapTimeZone[timeZone]).format("MMM DD YYYY");
        if (context) draw(context, title, timeStamp);
    }, [title, timeZone]);
    return (
        <StyledCanvasWrapper>
            <canvas ref={canvasRef} width="600" height="240" />
        </StyledCanvasWrapper>
    );
};
export default StampCanvas;
