const customisePDFTronToolbars = (header, toolbarGroup, itemsToUpdate) => {
    const newItems = header
        .getHeader(toolbarGroup)
        .getItems()
        .filter((item: { dataElement: string }) => itemsToUpdate.includes(item.dataElement));
    header.update(newItems);
};
export default customisePDFTronToolbars;
