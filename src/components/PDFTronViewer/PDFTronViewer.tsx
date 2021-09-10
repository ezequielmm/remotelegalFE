import React, { useRef, useEffect, useState, useCallback, useContext, Dispatch, SetStateAction } from "react";
import WebViewer, { Core, WebViewerInstance } from "@pdftron/webviewer";
import { initializeVideoViewer, renderControlsToDOM } from "@pdftron/webviewer-video";
import * as CONSTANTS from "../../constants/PDFTronViewer";
import { StyledPDFTronViewerContainer } from "./styles";
import StampModal from "./components/StampModal";
import Message from "../Message";
import { GlobalStateContext } from "../../state/GlobalState";
import { convertToXfdf } from "../../helpers/convertToXfdf";
import { AnnotationAction, AnnotationActionType } from "../../types/Annotation";
import { serializeToString } from "../../helpers/serializeToString";
import actions from "../../state/InDepo/InDepoActions";
import { useExhibitGetAnnotations, useExhibitRealTimeAnnotations } from "../../hooks/exhibits/hooks";
import useFloatingAlertContext from "../../hooks/useFloatingAlertContext";
import { LIVE_EXHIBIT_TAB } from "../../constants/exhibits";

export type AnnotationPayload = {
    action: string;
    details: string;
};
export interface PdfTronViewerProps {
    setShowSpinner?: Dispatch<SetStateAction<boolean>>;
    document?: string;
    filename?: string;
    activeKey?: string;
    showSpinner?: boolean;
    canStamp?: boolean;
    showStamp?: boolean;
    shouldGetAnnotations?: boolean;
    realTimeAnnotations?: boolean;
    onAnnotationChange?: (data: AnnotationPayload) => void;
    onDocumentReadyToDisplay?: () => void;
    setPage?: (page: string) => void;
    disableElements?: string[];
    readOnly?: boolean;
}

const PDFTronViewer = ({
    document,
    filename,
    showSpinner,
    canStamp,
    showStamp,
    shouldGetAnnotations,
    realTimeAnnotations,
    onAnnotationChange,
    onDocumentReadyToDisplay,
    setPage,
    disableElements = [],
    readOnly = false,
    setShowSpinner,
    activeKey,
}: PdfTronViewerProps) => {
    const addAlert = useFloatingAlertContext();
    const { state, dispatch } = useContext(GlobalStateContext);
    const { timeZone, currentExhibitPage, isRecording, stamp: stateStamp } = state.room;
    const [openStampModal, setStampModal] = useState(false);
    const viewerRef = useRef(null);
    const [PDFTron, setPDFTron] = useState<WebViewerInstance>(null);
    const shouldToastAppear = useRef(true);
    const [documentLoaded, setDocumentLoaded] = useState(false);
    const { getAllLatestAnnotations, savedAnnotations } = useExhibitGetAnnotations();
    const { realTimeAnnotation } = useExhibitRealTimeAnnotations();
    const { signalRConnectionStatus } = state?.signalR;

    const setAnnotationsToExport = async () => {
        const annotationsData = await PDFTron?.Core?.annotationManager.exportAnnotations();
        dispatch(actions.setExhibitDocument(PDFTron?.Core?.documentViewer?.getDocument(), annotationsData));
    };

    const drawAnnotationsFromList = async (annotationData) => {
        const importedAnnotations = await PDFTron?.Core?.annotationManager.importAnnotCommand(annotationData);
        await PDFTron?.Core?.annotationManager.drawAnnotationsFromList(importedAnnotations);
    };

    const handleStampLabel = async () => {
        const stamp = PDFTron?.Core?.annotationManager.getAnnotationById("STAMP");
        const stampLabel = stamp?.getCustomData("STAMP_LABEL");
        if (!stamp) {
            dispatch(actions.addStamp(null));
            return dispatch(actions.setStampLabel(""));
        }
        if (!canStamp) {
            stamp.ReadOnly = true;
        }
        const parser = new DOMParser();
        const serializedStamp = parser
            .parseFromString(
                await PDFTron?.Core?.annotationManager.exportAnnotations({
                    annotList: [stamp],
                }),
                "text/xml"
            )
            .getElementsByTagName("stamp")[0];
        dispatch(actions.addStamp(serializedStamp));
        return dispatch(actions.setStampLabel(stampLabel));
    };

    useEffect(() => {
        if (!isRecording && PDFTron) {
            PDFTron?.UI.setHeaderItems((header) => header.delete("rubberStampToolGroupButton"));
        }
        if (activeKey !== LIVE_EXHIBIT_TAB) {
            if (PDFTron) {
                PDFTron?.UI.setHeaderItems((header) => {
                    header.delete(CONSTANTS.OPEN_STAMP_MODAL_BUTTON.dataElement);
                });
            }
        }

        if (showStamp && canStamp && PDFTron && isRecording && !showSpinner && activeKey === LIVE_EXHIBIT_TAB) {
            PDFTron?.UI.setHeaderItems((header) => {
                header.delete("rubberStampToolGroupButton");
                header.get("customFullScreenButton").insertAfter({
                    ...CONSTANTS.OPEN_STAMP_MODAL_BUTTON,
                    onClick() {
                        if (stateStamp && shouldToastAppear.current) {
                            shouldToastAppear.current = false;
                            return Message({
                                content: "Please delete the existing stamp and try again",
                                type: "error",
                                duration: 3,
                            });
                        }
                        if (!stateStamp) {
                            shouldToastAppear.current = true;
                            return setStampModal(true);
                        }
                    },
                });
            });
        }
    }, [PDFTron, showStamp, canStamp, isRecording, showSpinner, stateStamp, activeKey]);

    const sendAnnotationChange = useCallback(
        (annotation, action: AnnotationActionType) => {
            if (annotation.nodeType !== annotation.TEXT_NODE) {
                const parser = new DOMParser();
                const annotationString = serializeToString(annotation);
                const commandData = parser.parseFromString(annotationString, "text/xml");
                const stamp = commandData.getElementsByTagName("stamp").length >= 1;
                if (stamp) {
                    dispatch(actions.addStamp(commandData.getElementsByTagName("stamp")[0]));
                }
                if (!onAnnotationChange) return;
                onAnnotationChange({
                    action,
                    details: convertToXfdf(annotationString, action),
                });
            }
        },
        [onAnnotationChange, dispatch]
    );

    const onAnnotationChangeHandler = async (
        changedAnnotations: Core.Annotations.Annotation[],
        action: string,
        info: Core.AnnotationManager.AnnotationChangedInfoObject
    ) => {
        if (info.imported) return;
        const { annotationManager } = PDFTron?.Core;
        const xfdfString = await annotationManager.exportAnnotCommand();
        const parser = new DOMParser();
        const commandData = parser.parseFromString(xfdfString, "text/xml");
        const addedAnnots = commandData.getElementsByTagName("add")[0];
        const modifiedAnnots = commandData.getElementsByTagName("modify")[0];
        const deletedAnnots = commandData.getElementsByTagName("delete")[0];

        addedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, AnnotationAction.Create);
        });
        modifiedAnnots.childNodes.forEach((child) => {
            if (child.nodeName !== "stamp" || canStamp) {
                sendAnnotationChange(child, AnnotationAction.Modify);
            }
        });
        deletedAnnots.childNodes.forEach((child) => {
            sendAnnotationChange(child, AnnotationAction.Delete);
        });

        const annotData = await annotationManager.exportAnnotations();
        dispatch(actions.setExhibitDocument(PDFTron?.Core?.documentViewer?.getDocument(), annotData));

        if (action === "delete") {
            changedAnnotations.forEach((annotation: Core.Annotations.Annotation) => {
                if (annotation.getCustomData("STAMP")) {
                    dispatch(actions.addStamp(null));
                    dispatch(actions.setStampLabel(""));
                }
            });
        }
    };

    const onDocumentLoadedHandler = () => {
        if (filename.toLowerCase().includes(".mp4")) {
            const customContainer = PDFTron?.UI.iframeWindow.document.querySelector(".custom-container");
            renderControlsToDOM(PDFTron, customContainer);
        }

        const { FitMode } = PDFTron?.UI;
        PDFTron?.UI.setFitMode(FitMode.FitWidth);
        setDocumentLoaded(true);
        setShowSpinner(false);
    };

    const onPageNumberUpdated = (page) => {
        setPage(page.toString());
    };

    useEffect(() => {
        if ((documentLoaded && shouldGetAnnotations) || signalRConnectionStatus?.isReconnected) {
            getAllLatestAnnotations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentLoaded, shouldGetAnnotations, signalRConnectionStatus?.isReconnected]);

    useEffect(() => {
        if (documentLoaded && shouldGetAnnotations && currentExhibitPage !== "-1") {
            PDFTron?.Core?.documentViewer?.setCurrentPage(currentExhibitPage);
            setTimeout(() => {
                PDFTron?.Core?.documentViewer?.setCurrentPage(currentExhibitPage);
            }, 1000);
        }
    }, [documentLoaded, currentExhibitPage, shouldGetAnnotations, PDFTron]);

    useEffect(() => {
        if (documentLoaded) {
            if (shouldGetAnnotations) {
                if (savedAnnotations) {
                    onDocumentReadyToDisplay();
                }
            } else {
                onDocumentReadyToDisplay();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentLoaded, savedAnnotations]);

    useEffect(() => {
        if (realTimeAnnotations) {
            drawAnnotationsFromList(realTimeAnnotation);
            handleStampLabel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [realTimeAnnotation]);

    useEffect(() => {
        // handle initial annotations
        savedAnnotations?.forEach(async (row) => {
            drawAnnotationsFromList(row);
        });
        if (savedAnnotations?.length) {
            handleStampLabel();
        }
        if (!savedAnnotations?.length) {
            setAnnotationsToExport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedAnnotations, PDFTron, canStamp, dispatch]);

    useEffect(() => {
        if (!readOnly) {
            if (signalRConnectionStatus?.isReconnecting) {
                PDFTron?.Core.annotationManager.enableReadOnlyMode();
                PDFTron?.UI.disableElements(["rubberStampToolGroupButton"]);
            } else {
                PDFTron?.Core.annotationManager.disableReadOnlyMode();
                PDFTron?.UI.disableElements(["toolbarGroup-Measure"]);
                PDFTron?.UI.enableElements(["rubberStampToolGroupButton"]);
            }
        }
    }, [signalRConnectionStatus?.isReconnecting, PDFTron, readOnly]);

    useEffect(() => {
        const startViewer = () => {
            WebViewer(
                {
                    licenseKey:
                        "Precision Reporters LLC(precisionreporters.com):OEM:Remote Legal::B+:AMS(20220210):72A5A0AD0457260A7360B13AC982737860616F5CD9387AD28B625582AD4C3EB6329431F5C7",
                    css: "../../PDFTronStyles.css",
                    path: "/webviewer/lib/",
                    disabledElements: CONSTANTS.DISABLED_BUTTONS.concat(disableElements),
                },
                viewerRef.current
            ).then((instance) => {
                const { Core, UI } = instance;
                Core.annotationManager.disableFreeformRotation();
                if (readOnly) {
                    Core.annotationManager.setReadOnly(true);
                }
                UI.setTheme("dark");
                UI.setHeaderItems((header) => {
                    header
                        .get("panToolButton")
                        .insertAfter({
                            ...CONSTANTS.FULL_SCREEN_BUTTON,
                            onClick() {
                                UI.toggleFullScreen();
                            },
                        })
                        .get("customFullScreenButton");
                    const newItems = header
                        .getHeader("toolbarGroup-Annotate")
                        .getItems()
                        .filter((item: { dataElement: string; toolName: string }) =>
                            CONSTANTS.ANNOTATE_ITEMS.includes(item.dataElement || item.toolName)
                        );
                    header.update(newItems);
                });
                UI.setToolbarGroup("toolbarGroup-View", true);
                const newContextMenuItems = UI.contextMenuPopup
                    .getItems()
                    .filter((item: { dataElement: string }) => CONSTANTS.CONTEXT_MENU_ITEMS.includes(item.dataElement));
                UI.contextMenuPopup.update(newContextMenuItems);
                setPDFTron(instance);
            });
        };

        startViewer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPDFTronVideo = async (instance, video) => {
        try {
            const { loadVideo } = await initializeVideoViewer(
                instance,
                "Precision Reporters LLC(precisionreporters.com):OEM:Remote Legal::B+:AMS(20220210):72A5A0AD0457260A7360B13AC982737860616F5CD9387AD28B625582AD4C3EB6329431F5C7"
            );
            loadVideo(`${video}&`);
        } catch (error) {
            console.error("pdftron loadvideo error", error);
        }
    };

    useEffect(() => {
        const alertError = (error) => {
            console.error("error while loading PDF file", error?.detail);
            addAlert({
                message: "An error occurred while loading the file",
                type: "error",
                showIcon: false,
                duration: 4,
                dataTestId: "pdftron-error-alert",
            });
            setShowSpinner(false);
        };
        if (PDFTron && document && filename) {
            PDFTron?.UI.iframeWindow.addEventListener("loaderror", alertError);
            PDFTron?.Core.annotationManager.addEventListener("annotationChanged", onAnnotationChangeHandler);
            PDFTron?.Core.documentViewer.addEventListener("documentLoaded", onDocumentLoadedHandler);
            PDFTron?.Core.documentViewer.addEventListener("pageNumberUpdated", onPageNumberUpdated);
            PDFTron?.UI.setToolbarGroup("toolbarGroup-View", true);
            if (filename.toLowerCase().includes(".mp4")) {
                loadPDFTronVideo(PDFTron, document);
            } else {
                PDFTron?.UI.loadDocument(document, { filename: filename.replace(/\.\w{3,4}($)/gim, ".pdf") });
            }
        }
        return () => {
            PDFTron?.UI?.iframeWindow.removeEventListener("loaderror", alertError);
            PDFTron?.Core?.annotationManager.removeEventListener("annotationChanged", onAnnotationChangeHandler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canStamp, document, PDFTron, filename]);

    const stampDocument = async (stampImage: string, stampLabel: string) => {
        const { annotationManager, Annotations } = PDFTron?.Core;
        const stamp = new Annotations.StampAnnotation();
        await stamp.setImageData(stampImage);
        stamp.LockedContents = true;
        stamp.setCustomData("STAMP", stampImage);
        stamp.setCustomData("STAMP_LABEL", stampLabel);
        stamp.Id = "STAMP";
        stamp.PageNumber = 1;
        stamp.setX(0);
        stamp.setY(0);
        stamp.Width = (PDFTron?.Core?.documentViewer?.getPageHeight(1) * 30) / 100;
        stamp.Height = (PDFTron?.Core?.documentViewer?.getPageHeight(1) * 10) / 100;
        stamp.MaintainAspectRatio = true;
        annotationManager.addAnnotation(stamp, null);
        annotationManager.redrawAnnotation(stamp);
        dispatch(actions.setStampLabel(stampLabel));
    };

    return (
        <>
            <StampModal
                open={openStampModal}
                timeZone={timeZone}
                onConfirm={stampDocument}
                handleClose={setStampModal}
            />
            <StyledPDFTronViewerContainer
                style={{ visibility: documentLoaded ? "visible" : "hidden" }}
                ref={viewerRef}
            />
        </>
    );
};

export default PDFTronViewer;
