import { AnalysisService } from "../analysis/analysis.service";

describe("AnalysisService.score", () => {
  it("flags unrealistic salary and payment request", () => {
    const text =
      "Congratulations! You get selected. Salary: ₹80,000/month. Please pay registration fee of 2000.";
    const res = AnalysisService.score(text);
    expect(res.reasons.length).toBeGreaterThanOrEqual(2);
    expect(res.isFake).toBeTruthy();
  });

  it("returns safe for normal text", () => {
    const text =
      "We would like to invite you for an interview next week. No fees required.";
    const res = AnalysisService.score(text);
    expect(res.isFake).toBe(false);
  });
});
