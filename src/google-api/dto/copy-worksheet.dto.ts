import { spreadSheetsId } from '../interfaces/valid-id-spreadsheets.interface';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
    IsPositive, IsString, MinLength 
} from 'class-validator';

export class CopySheetDto {

    @IsString()
    @MinLength(1)
    spreadSheetId: keyof typeof spreadSheetsId;

    @IsString()
    @IsOptional()
    workSheetTitle: string;



}
