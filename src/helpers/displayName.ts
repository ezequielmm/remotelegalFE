export const displayName = (firstName: string = "", lastName: string = "", inverse: boolean = false) =>
    inverse ? `${lastName} ${firstName}`.trim() : `${firstName} ${lastName}`.trim();
