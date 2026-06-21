import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum ReportSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class ReportScamDto {
  @IsString()
  companyName!: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsString()
  scamType!: string;

  @IsString()
  description!: string;

  @IsEnum(ReportSeverity)
  severity!: ReportSeverity;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;
}
