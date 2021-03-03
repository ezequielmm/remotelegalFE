import React, { ReactElement } from "react";
import Icon from "../Icon";
import { ReactComponent as pdfIcon } from "../../assets/general/Acrobat.svg";
import { ReactComponent as docIcon } from "../../assets/general/Document.svg";
import { ReactComponent as imgIcon } from "../../assets/general/Image.svg";
import { ReactComponent as videoIcon } from "../../assets/general/Video.svg";
import FileTypes from "../../types/FileTypes";
import { IIconProps } from "../Icon/Icon";

export interface IFileIconProps extends Pick<IIconProps, "size"> {
    type: FileTypes;
}

export default function FileIcon({ type, size = 9 }: IFileIconProps): ReactElement {
    const icons = {
        pdf: pdfIcon,
        doc: docIcon,
        docx: docIcon,
        xls: docIcon,
        xlsx: docIcon,
        ppt: docIcon,
        pptx: docIcon,
        jpg: imgIcon,
        jpeg: imgIcon,
        png: imgIcon,
        mp4: videoIcon,
    };

    return <Icon icon={icons[type]} size={size} />;
}
