export class ScamTypeDto {
  name!: string;
  value!: number;
  color!: string;
}

export class TrendDataDto {
  month!: string;
  safe!: number;
  scams!: number;
}

export class ConversionDataDto {
  month!: string;
  rate!: number;
}

export class AnalyticsDto {
  scamTypes!: ScamTypeDto[];
  trendData!: TrendDataDto[];
  conversionData!: ConversionDataDto[];
}
