import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
    IsPositive, IsString, MinLength 
} from 'class-validator';

export class CreateRows {

    @IsString()
    @MinLength(1)
    id: string;

    @IsString()
    @MinLength(1)
    id_raw: string;

    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsOptional()
    rawMaterial: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    notes?:string;

    @IsString()
    @MinLength(1)
    @IsOptional()
    step: string;

    @MinLength(1)
    @IsNumber()
    @IsOptional()
    weight: number;

    @IsNumber()
    @IsOptional()
    percentage: number;

    @MinLength(1)
    @IsString()
    @IsOptional()
    characteristics: string;

    @MinLength(1)
    @IsString()
    @IsOptional()
    date:string;

    @MinLength(1)
    @IsString()
    @IsOptional()
    lote:string

    @MinLength(1)
    @IsString()
    @IsOptional()
    OP:string



}