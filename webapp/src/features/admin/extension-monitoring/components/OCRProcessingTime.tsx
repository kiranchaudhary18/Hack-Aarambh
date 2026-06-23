import { FileImage } from "lucide-react";
import { ocrProcessingTime } from "../data/performanceData";

export function OCRProcessingTime() {
  const stats = [
    { label: "Average", value: `${ocrProcessingTime.avg}ms` },
    { label: "p50", value: `${ocrProcessingTime.p50}ms` },
    { label: "p95", value: `${ocrProcessingTime.p95}ms` },
  ];

  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          OCR Processing Time
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-green-500/20">
          <FileImage className="h-5 w-5 text-green-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          ocrProcessingTime.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {ocrProcessingTime.change} from last week
      </p>
    </div>
  );
}
