import { AnnotationAction, AnnotationActionType } from "../types/Annotation";

export const convertToXfdf = (changedAnnotation, action: AnnotationActionType) => {
    let xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields />`;
    if (action === AnnotationAction.Create) {
        xfdfString += `<add>${changedAnnotation}</add><modify /><delete />`;
    } else if (action === AnnotationAction.Modify) {
        xfdfString += `<add /><modify>${changedAnnotation}</modify><delete />`;
    } else if (action === AnnotationAction.Delete) {
        xfdfString += `<add /><modify /><delete>${changedAnnotation}</delete>`;
    }
    xfdfString += `</xfdf>`;
    return xfdfString;
};
