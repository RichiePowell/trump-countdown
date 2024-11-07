import React, { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TermProgress {
  bidenDays: number;
  trumpDays: number;
  currentDayIndex: number;
  daysSinceElection: number;
}

interface CountdownUnitProps {
  value: number;
  label: string;
  isMain?: boolean;
}

interface CustomCSSProperties extends React.CSSProperties {
  "--color-animation"?: string;
}

const CountdownUnit: React.FC<CountdownUnitProps> = ({
  value,
  label,
  isMain = false,
}) => (
  <div className="flex items-baseline gap-3">
    <div
      className={`font-bold text-gray-800 ${isMain ? "text-8xl" : "text-3xl"}`}
    >
      {String(value)}
    </div>
    <div className={`${isMain ? "text-4xl" : "text-xl"} text-gray-500`}>
      {label}
    </div>
  </div>
);

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [termProgress, setTermProgress] = useState<TermProgress>({
    bidenDays: 0,
    trumpDays: 0,
    currentDayIndex: 0,
    daysSinceElection: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): void => {
      const electionDay = new Date("2024-11-05T00:00:00");
      const bidenEndDate = new Date("2025-01-20T12:00:00");
      const trumpEndDate = new Date("2029-01-20T12:00:00");
      const now = new Date();

      // Calculate days since election
      const msSinceElection = now.getTime() - electionDay.getTime();
      const daysSinceElection = Math.floor(
        msSinceElection / (1000 * 60 * 60 * 24)
      );

      // Calculate time until Trump's term ends
      const difference = trumpEndDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }

      const bidenDays = Math.ceil(
        (bidenEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const trumpDays = Math.ceil(
        (trumpEndDate.getTime() - bidenEndDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      setTermProgress({
        bidenDays,
        trumpDays,
        daysSinceElection: Math.max(0, daysSinceElection),
        currentDayIndex: Math.max(0, daysSinceElection),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalDots = [...Array(termProgress.bidenDays + termProgress.trumpDays)];

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-100 min-h-screen p-6">
      <style>
        {`
          @keyframes scaleAnimation {
            0%, 100% { transform: scale(0.9); }
            50% { transform: scale(1.2); }
          }
          @keyframes blueColorPulse {
            0%, 100% { background-color: rgb(147, 197, 253); }
            50% { background-color: rgb(59, 130, 246); }
          }
          @keyframes redColorPulse {
            0%, 100% { background-color: rgb(252, 165, 165); }
            50% { background-color: rgb(239, 68, 68); }
          }
          .current-dot {
            animation: scaleAnimation 2s ease-in-out infinite,
                       var(--color-animation) 2s ease-in-out infinite;
          }
          body {
            background-color: rgb(243, 244, 246);
          }
        `}
      </style>
      <div className="pt-16 pb-12">
        <div className="text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center">
              <CountdownUnit value={timeLeft.days} label="days" isMain={true} />
            </div>

            <div className="flex justify-center gap-8">
              <CountdownUnit value={timeLeft.hours} label="hours" />
              <CountdownUnit value={timeLeft.minutes} label="minutes" />
              <CountdownUnit value={timeLeft.seconds} label="seconds" />
            </div>

            <div className="text-3xl text-gray-600 font-medium mt-4">
              Until Trump leaves the White House
            </div>
          </div>
        </div>
      </div>

      <CardContent className="space-y-8 bg-white/80 rounded-xl shadow-sm">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-1 p-6">
            {totalDots.map((_, index) => {
              const isBidenTerm = index < termProgress.bidenDays;
              const isPastDay = index < termProgress.currentDayIndex;
              const isCurrentDay = index === termProgress.currentDayIndex;

              const dotStyle: CustomCSSProperties = isCurrentDay
                ? {
                    "--color-animation": isBidenTerm
                      ? "blueColorPulse"
                      : "redColorPulse",
                  }
                : {};

              return (
                <div
                  key={`dot-${index}`}
                  style={dotStyle}
                  className={`w-2.5 h-2.5 rounded-full ${
                    isCurrentDay
                      ? "current-dot"
                      : isBidenTerm
                      ? isPastDay
                        ? "bg-blue-300/50"
                        : "bg-blue-500"
                      : isPastDay
                      ? "bg-red-300/50"
                      : "bg-red-500"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center text-sm px-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-600">
                Joe Biden ({termProgress.bidenDays} days)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600">
                Donald Trump ({termProgress.trumpDays} days)
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-500 px-6 pb-4">
            <div>Election day: Nov 5, 2024</div>
            <div>Biden's term end: Jan 20, 2025</div>
            <div>Trump's term end: Jan 20, 2029</div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default App;
