const customisePDFTronToolbars = (header, toolbarGroup, itemsToUpdate) => {
    const newItems = header
        .getHeader(toolbarGroup)
        .getItems()
        .filter((item: { dataElement: string; toolName: string }) =>
            itemsToUpdate.includes(item.dataElement || item.toolName)
        );
    header.update(newItems);
};
export default customisePDFTronToolbars;
