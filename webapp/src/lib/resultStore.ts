import { JobCheck } from "./mockData";

let last: JobCheck | null = null;
export const resultStore = {
  set(c: JobCheck) { last = c; },
  get() { return last; },
};
