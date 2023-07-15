import { PartialType } from '@nestjs/mapped-types';
import { CreateRows } from './create-Rows.dto';


export class UpdateRowDTO extends PartialType(CreateRows) {}