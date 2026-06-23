import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ApproveReportDto {
  @IsString()
  @IsNotEmpty()
  adminId!: string;
}

export class RejectReportDto {
  @IsString()
  @IsNotEmpty()
  adminId!: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
