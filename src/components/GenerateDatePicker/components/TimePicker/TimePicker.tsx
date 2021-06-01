import * as React from "react";
import DatePicker from "../../GenerateDatePicker";
import { TimePickerProps } from "../../interfaces/interfaces";

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
    return <DatePicker {...props} picker="time" ref={ref} />;
});

TimePicker.displayName = "TimePicker";

export default TimePicker;
