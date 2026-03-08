import { Button } from "@clab/design-system";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { createPortal } from "react-dom";

import "./ActivityCalendar.css";
import "./DatePickerBottomSheet.css";

type AnimationState = "entering" | "entered" | "exiting" | "exited";

interface DatePickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onSelect: (dateStr: string) => void;
}

export default function DatePickerBottomSheet({
  isOpen,
  onClose,
  title,
  value,
  onSelect,
}: DatePickerBottomSheetProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const parsed = value ? dayjs(value, "YYYY-MM-DD") : dayjs();
    return parsed.isValid() ? parsed.toDate() : new Date();
  });
  const [animationState, setAnimationState] = useState<AnimationState>(
    isOpen ? "entered" : "exited",
  );
  const [shouldRender, setShouldRender] = useState(isOpen);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const parsed = value ? dayjs(value, "YYYY-MM-DD") : dayjs();
      const nextDate = parsed.isValid() ? parsed.toDate() : new Date();
      const minDate = dayjs().startOf("day");
      const dateToUse = dayjs(nextDate).isBefore(minDate)
        ? minDate.toDate()
        : nextDate;
      queueMicrotask(() => setSelectedDate(dateToUse));
    }
  }, [isOpen, value]);

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        setShouldRender(true);
        setAnimationState("entering");
      });
      const timer = setTimeout(() => setAnimationState("entered"), 300);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
    queueMicrotask(() => setAnimationState("exiting"));
    const timer = setTimeout(() => {
      setAnimationState("exited");
      setShouldRender(false);
      document.body.style.overflow = "";
    }, 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleOverlayClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleConfirm = () => {
    onSelect(dayjs(selectedDate).format("YYYY-MM-DD"));
    handleClose();
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={`date-picker-overlay ${animationState}`}
      onClick={handleOverlayClick}
      aria-hidden
    >
      <div
        className={`date-picker-container ${animationState}`}
        onClick={handleContainerClick}
      >
        <div className="date-picker-drag-handle" />
        <div className="border-gray-2 px-xl py-lg flex items-center justify-between border-b">
          <h3 className="text-18-semibold text-black">{title}</h3>
          <Button size="small" color="active" onClick={handleConfirm}>
            확인
          </Button>
        </div>
        <div className="date-picker-calendar p-xl overflow-y-auto">
          <Calendar
            value={selectedDate}
            minDate={dayjs().startOf("day").toDate()}
            onChange={(val) => {
              if (val instanceof Date) setSelectedDate(val);
            }}
            formatDay={(_, date) => dayjs(date).format("D")}
            formatMonthYear={(_, date) => dayjs(date).format("YYYY년 M월")}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
