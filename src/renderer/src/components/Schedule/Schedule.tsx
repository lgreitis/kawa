import { useUserAiringScheduleQuery } from "@renderer/services/schedule/scheduleQueries";
import { endOfWeek, format, fromUnixTime, getUnixTime, startOfWeek } from "date-fns";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Skeleton } from "../Skeleton/Skeleton";

export const Schedule: React.FC = () => {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");
  const weekStart = getUnixTime(startOfWeek(now, { weekStartsOn: 1 }));
  const weekEnd = getUnixTime(endOfWeek(now, { weekStartsOn: 1 }));

  const { data: schedules, isLoading } = useUserAiringScheduleQuery({
    weekStart,
    weekEnd,
    page: 1,
  });

  const scheduleByDay = useMemo(() => {
    if (!schedules) return null;
    return schedules
      .slice()
      .sort((a, b) => a.airingAt - b.airingAt)
      .reduce<Record<string, typeof schedules>>((acc, schedule) => {
        const day = format(fromUnixTime(schedule.airingAt), "yyyy-MM-dd");
        if (!acc[day]) acc[day] = [];
        acc[day].push(schedule);
        return acc;
      }, {});
  }, [schedules]);

  return (
    <div className="flex flex-col gap-6 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your schedule</h1>
      </div>
      {isLoading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg p-3">
              <Skeleton className="h-4 w-64" />
              <div className="border-b border-white/10"></div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && scheduleByDay?.length === 0 && (
        <div className="flex min-h-48 flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-6 text-center">
          <p className="text-sm text-white/70">You have no scheduled anime for this week.</p>
        </div>
      )}
      {scheduleByDay &&
        Object.entries(scheduleByDay).map(([day, schedules]) => {
          const isToday = day === today;
          return (
            <div
              key={day}
              className={twMerge(
                "flex flex-col gap-2 rounded-lg p-3",
                isToday ? "bg-white/10 ring-1 ring-white/20" : "",
              )}
            >
              <h2
                className={twMerge(
                  "flex items-center gap-2 border-b pb-1 text-sm font-semibold uppercase tracking-widest",
                  isToday ? "border-white/30 text-white" : "border-white/10 text-white/60",
                )}
              >
                {format(new Date(day), "EEEE, MMMM d")}
                {isToday && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold normal-case tracking-normal text-black">
                    Today
                  </span>
                )}
              </h2>
              <div className="flex flex-col gap-1">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between text-white">
                    {schedule.malId ? (
                      <Link to={`/info/${schedule.malId}`} className="hover:underline">
                        {schedule.media.title.english ?? schedule.media.title.romaji}
                      </Link>
                    ) : (
                      <span>{schedule.media.title.english ?? schedule.media.title.romaji}</span>
                    )}
                    <span className={`text-sm ${isToday ? "text-white/70" : "text-white/50"}`}>
                      {format(fromUnixTime(schedule.airingAt), "h:mm a")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};
