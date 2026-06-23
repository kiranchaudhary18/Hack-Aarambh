import { MemoryStick } from "lucide-react";
import { memoryUsage } from "../data/systemResourcesData";

export function MemoryUsage() {
  return (
    <div className="clay p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Usage
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-500/20">
          <MemoryStick className="h-5 w-5 text-purple-500" />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">RAM</p>
          <p className="mt-1 font-display text-2xl font-bold">{memoryUsage.ram.percentage}%</p>
          <p className="text-xs text-muted-foreground">
            {memoryUsage.ram.used}GB / {memoryUsage.ram.total}GB
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Swap</p>
          <p className="mt-1 font-display text-2xl font-bold">{memoryUsage.swap.percentage}%</p>
          <p className="text-xs text-muted-foreground">
            {memoryUsage.swap.used}GB / {memoryUsage.swap.total}GB
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span>Buffers: {memoryUsage.buffers}GB</span>
        <span>Cache: {memoryUsage.cache}GB</span>
      </div>
      <p
        className={`mt-3 text-xs font-medium ${
          memoryUsage.change.startsWith("-") ? "text-green-500" : "text-red-500"
        }`}
      >
        {memoryUsage.change} from last hour
      </p>
    </div>
  );
}
