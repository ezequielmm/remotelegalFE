const debounce = (func: (args?: any) => void, wait: number) => {
    let timeout;
    return function executedFunction(...rest) {
        const later = () => {
            timeout = null;
            func(...rest);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
export default debounce;
