import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class SearchSuggestionDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 5;
}
