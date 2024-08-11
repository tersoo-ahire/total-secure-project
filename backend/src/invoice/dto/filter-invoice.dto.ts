import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterInvoiceDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;
}
