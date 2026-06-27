import { IsOptional, IsString, IsInt, Min, IsEnum, IsArray } from 'class-validator';

export enum SearchType {
  ALL = 'all',
  COMPANY = 'company',
  DOMAIN = 'domain',
  PATTERN = 'pattern',
}

export enum Severity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export class SearchQueryDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsEnum(SearchType)
  type?: SearchType;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @IsOptional()
  @IsArray()
  @IsEnum(Severity, { each: true })
  severities?: Severity[];

  @IsOptional()
  @IsString()
  source?: 'internal' | 'external' | 'all';

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
