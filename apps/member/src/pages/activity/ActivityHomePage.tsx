import { Section } from "@clab/design-system";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import {
  ActivityCalendar,
  ActivityCalendarHeader,
  ActivityScheduleList,
} from "@/components/activity";

import { scheduleQueries } from "@/api/schedule/api.query";

import ActivityStudyPage from "./ActivityStudyPage";

export default function ActivityHomePage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const scheduleRequest = useMemo(
    () => ({
      startDate: dayjs(currentMonth).startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs(currentMonth).endOf("month").format("YYYY-MM-DD"),
      page: 1,
      size: 100,
    }),
    [currentMonth],
  );

  const { data: scheduleData } = useQuery(
    scheduleQueries.getSchedulesQuery(scheduleRequest),
  );

  const schedules = useMemo(
    () => scheduleData?.items ?? [],
    [scheduleData?.items],
  );
  const eventDates = useMemo(
    () =>
      new Set(
        schedules.map((s) => dayjs(s.startDateTime).format("YYYY-MM-DD")),
      ),
    [schedules],
  );

  if (tab === "study") {
    return <ActivityStudyPage />;
  }

  return (
    <>
      <Section
        title={
          <ActivityCalendarHeader
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        }
        className="px-gutter"
      >
        <ActivityCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          activeStartDate={currentMonth}
          onActiveStartDateChange={setCurrentMonth}
          eventDates={eventDates}
        />
      </Section>
      <Section title="일정" className="px-gutter">
        <ActivityScheduleList
          schedules={schedules}
          selectedDate={selectedDate}
        />
      </Section>
    </>
  );
}
