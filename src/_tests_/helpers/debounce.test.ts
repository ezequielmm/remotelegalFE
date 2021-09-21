import debounce from "../../helpers/debounce";
import { wait } from "../../helpers/wait";

test("should debounce the function", async () => {
    const debouncedFunction = jest.fn();
    const debouncer = debounce(debouncedFunction, 500);
    debouncer();
    debouncer();
    debouncer();
    await wait(500);
    expect(debouncedFunction).toHaveBeenCalledTimes(1);
});
