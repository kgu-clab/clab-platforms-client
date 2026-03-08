import dayjs from "dayjs";
import Calendar from "react-calendar";

import "./ActivityCalendar.css";

interface ActivityCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  activeStartDate: Date;
  onActiveStartDateChange: (date: Date) => void;
  eventDates?: Set<string>;
}

export default function ActivityCalendar({
  value,
  onChange,
  activeStartDate,
  onActiveStartDateChange,
  eventDates,
}: ActivityCalendarProps) {
  return (
    <Calendar
      value={value}
      onChange={(value) => {
        if (value instanceof Date) {
          onChange(value);
        }
      }}
      activeStartDate={activeStartDate}
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate) {
          onActiveStartDateChange(activeStartDate);
        }
      }}
      formatDay={(_, date) => dayjs(date).format("D")}
      tileClassName={({ date, view }) => {
        if (view !== "month") return undefined;
        const key = dayjs(date).format("YYYY-MM-DD");
        return eventDates?.has(key)
          ? "react-calendar__tile--hasEvent"
          : undefined;
      }}
    />
  );
}
