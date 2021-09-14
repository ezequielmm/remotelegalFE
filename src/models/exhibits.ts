export interface IPreSignUploadExhibitHeader {
    "x-amz-meta-user-id": string;
    "x-amz-meta-deposition-id": string;
    "x-amz-meta-case-id": string;
    "x-amz-meta-display-name": string;
    "x-amz-meta-type": string;
    "x-amz-meta-document-type": string;
}

export interface IPreSignUploadExhibit {
    url: string;
    headers: IPreSignUploadExhibitHeader;
}

export interface IPayloadPreSignUploadExhibit {
    depositionId: string;
    filename: string;
    resourceId: string;
}
