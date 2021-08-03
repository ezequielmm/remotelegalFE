import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Alert from "prp-components-library/src/components/Alert";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { ReactComponent as TimeIcon } from "../../../assets/icons/time.svg";
import { ReactComponent as InfoIcon } from "../../../assets/icons/information.svg";
import { ContainerProps, StyledLayoutContent, StyledLayoutCotainer } from "../styles";
import { HiddenRef, RoughDraftPill, StyledRealTimeContainer, StyledRealTimeInner } from "./styles";
import TranscriptionText from "./TranscriptText";
import * as CONSTANTS from "../../../constants/inDepo";
import ColorStatus from "../../../types/ColorStatus";
import { mapTimeZone, TimeZones } from "../../../models/general";
import { TranscriptionModel } from "../../../models";
import useWindowSize from "../../../hooks/useWindowSize";

dayjs.extend(utc);
dayjs.extend(timezone);

const RealTime = ({
    disableAutoscroll,
    manageTranscriptionClicked,
    timeZone,
    transcriptions,
    playedTimeValue,
    scrollToHighlighted,
    transcriptionsWithoutEvents,
}: ContainerProps & {
    disableAutoscroll?: boolean;
    manageTranscriptionClicked?: (transcription: TranscriptionModel.Transcription) => void;
    timeZone: TimeZones;
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    transcriptionsWithoutEvents?: TranscriptionModel.Transcription[];
    playedTimeValue?: number;
    scrollToHighlighted?: boolean;
}) => {
    const layoutContentRef = useRef(null);
    const [currentTranscript, setCurrentTranscript] = useState(null);
    const [windowWidth] = useWindowSize();

    useEffect(() => {
        const highlightTranscript = () => {
            const lastTranscription = transcriptionsWithoutEvents[transcriptionsWithoutEvents.length - 1];
            if (playedTimeValue >= lastTranscription?.transcriptionVideoTime) {
                return setCurrentTranscript(lastTranscription?.id);
            }
            const currentTranscriptTranscription = transcriptionsWithoutEvents.find(
                (transcription, index) =>
                    playedTimeValue <=
                    transcription?.transcriptionVideoTime +
                        transcriptionsWithoutEvents[index + 1]?.transcriptionVideoTime -
                        transcription?.transcriptionVideoTime
            );

            return setCurrentTranscript(currentTranscriptTranscription?.id);
        };

        if (transcriptionsWithoutEvents?.length && playedTimeValue) {
            highlightTranscript();
        }
    }, [playedTimeValue, transcriptionsWithoutEvents]);

    const transcriptionSlicingLength = transcriptions?.length > 20 ? transcriptions?.length - 20 : 0;

    const sortedTranscriptions = !scrollToHighlighted
        ? transcriptions
              ?.slice(transcriptionSlicingLength)
              .sort((a, b) => new Date(a?.transcriptDateTime)?.getTime() - new Date(b?.transcriptDateTime)?.getTime())
        : [];

    const transcriptionsWithoutDuplicates = !scrollToHighlighted
        ? [].concat(transcriptions?.slice(0, transcriptionSlicingLength), sortedTranscriptions)
        : transcriptions;

    useEffect(() => {
        if (!scrollToHighlighted && transcriptionsWithoutDuplicates?.length) {
            setCurrentTranscript(transcriptionsWithoutDuplicates[transcriptionsWithoutDuplicates?.length - 1]?.id);
        }
    }, [scrollToHighlighted, transcriptionsWithoutDuplicates]);

    const listRef = useRef(null);
    const sizeMap = useRef({});
    const setSize = (index, size) => {
        listRef.current.resetAfterIndex(0);
        sizeMap.current = { ...sizeMap.current, [index]: size };
    };
    const getSize = (index) => {
        return !disableAutoscroll
            ? sizeMap.current[index] + (index === 0 ? 70 : 15) || 50
            : sizeMap.current[index] + 15 || 50;
    };

    const transcriptionsToRender = !disableAutoscroll
        ? [{}, ...transcriptionsWithoutDuplicates]
        : transcriptionsWithoutDuplicates.filter(({ index }) => index !== 0);

    const [isAutoscrolling, setIsAutoscrolling] = useState(false);
    const scrollToIndex = transcriptionsToRender.findIndex((transcription) => currentTranscript === transcription.id);

    useEffect(() => {
        if (isAutoscrolling) {
            listRef?.current?.scrollToItem(scrollToIndex);
        }
    }, [scrollToIndex, isAutoscrolling]);

    const validateAutoscrolling = ({ visibleStopIndex }) => {
        setIsAutoscrolling(false);
        if (visibleStopIndex >= transcriptionsToRender.length - 2 || scrollToHighlighted) {
            setIsAutoscrolling(true);
        }
    };

    const Row = ({
        index,
        setSize,
        windowWidth,
        data,
    }: {
        index: number;
        setSize: (index: number, size: number) => void;
        windowWidth: number;
        data: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    }) => {
        const rowRef = useRef(null);

        useEffect(() => {
            setSize(index, rowRef.current.getBoundingClientRect().height);
        }, [setSize, index, windowWidth]);

        if (index === 0 && !disableAutoscroll) {
            return (
                <div ref={rowRef}>
                    <RoughDraftPill>ROUGH DRAFT: NOT FOR OFFICIAL USE</RoughDraftPill>
                </div>
            );
        }

        return (
            <StyledRealTimeInner ref={rowRef}>
                {(data[index].from || data[index].text) &&
                    (data[index].from ? (
                        <Alert
                            data-testid={data[index].to ? "transcription_paused" : "transcription_currently_paused"}
                            key={data[index].id}
                            message={
                                data[index].to
                                    ? CONSTANTS.getPauseText(data[index].from, data[index].to, timeZone)
                                    : CONSTANTS.TRANSCRIPTIONS_PAUSED
                            }
                            type={data[index].to ? "info" : "warning"}
                            icon={<Icon icon={data[index].to ? TimeIcon : InfoIcon} />}
                        />
                    ) : (
                        <Space direction="vertical" key={data[index].id}>
                            {playedTimeValue !== undefined &&
                                (index === 0 || playedTimeValue - data[index].prevEndTime >= 0) &&
                                playedTimeValue - data[index].transcriptionVideoTime < 0 && <HiddenRef />}
                            <Text
                                state={ColorStatus.disabled}
                                font="code"
                                size="small"
                                weight="bold"
                                block
                                dataTestId="transcription_title"
                            >
                                <>
                                    {`${data[index].userName || "Guest"} `}
                                    {dayjs(data[index].transcriptDateTime)
                                        .tz(mapTimeZone[timeZone])
                                        ?.format("hh:mm:ss A")}
                                </>
                            </Text>
                            <TranscriptionText
                                font="code"
                                size="small"
                                block
                                ellipsis={false}
                                dataTestId="transcription_text"
                                highlighted={scrollToHighlighted && currentTranscript === data[index].id}
                                pointer={!!manageTranscriptionClicked}
                                onClick={() => {
                                    if (manageTranscriptionClicked) manageTranscriptionClicked(data[index]);
                                }}
                            >
                                {data[index].text}
                            </TranscriptionText>
                        </Space>
                    ))}
            </StyledRealTimeInner>
        );
    };

    return (
        <StyledLayoutCotainer noBackground={disableAutoscroll}>
            <StyledLayoutContent ref={layoutContentRef}>
                <StyledRealTimeContainer
                    height={layoutContentRef?.current?.offsetHeight || 0}
                    itemCount={transcriptionsToRender.length}
                    itemSize={getSize}
                    itemData={transcriptionsToRender}
                    ref={listRef}
                    onItemsRendered={validateAutoscrolling}
                >
                    {({ index, style, data }) => {
                        return (
                            <>
                                <div style={style}>
                                    <Row index={index} setSize={setSize} windowWidth={windowWidth} data={data} />
                                </div>
                            </>
                        );
                    }}
                </StyledRealTimeContainer>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default RealTime;
