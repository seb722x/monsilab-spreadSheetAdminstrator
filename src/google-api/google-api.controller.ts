import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GoogleApiService } from './google-api.service';
import { GoogleSheetDto } from './dto/sheets-Id.dto';
import { WorksheetBasicProperties } from 'google-spreadsheet';
import { CreateRows } from './dto/create-Rows.dto';
import { spreadSheetsId } from './interfaces/valid-id-spreadsheets.interface';
import { UpdateRowDTO } from './dto/update-rows.dto';
import { CopySheetDto } from './dto/copy-worksheet.dto';

@Controller('googlesheet')
export class GoogleApiController {
  
  constructor(private readonly googleApiService: GoogleApiService) {}

 
 
  @Get('load-spreadSheet/:validSpreadId')
    async loadSpread(
      @Param('validSpreadId') validSpreadId:keyof typeof spreadSheetsId)
      {
        const spreasdSheet = await this.googleApiService.loadMemoSpreadSheet(validSpreadId);
        return `Spread sheet: -- ${spreasdSheet.title} -- cargada en memoria exitosamente`;
      }

  @Get('load-workSheet')
    async loadWork(
      @Query() sheetDto:GoogleSheetDto
      ){
        const spreasdSheet = await this.googleApiService.loadMemoWorkSheet(sheetDto);
        return `google WorkSheet : -- ${spreasdSheet.title} -- cargada en memoria exitosamente`;
      }
    
 
 
  @Get("find-workSheet")
    async loadSheet( 
      @Query() sheetDto:GoogleSheetDto) 
      {
        const workSheet = await this.googleApiService.getWorkSheet(sheetDto);
        return `google WorkSheet loaded correctly:  --${workSheet.title}--  with id: ${workSheet.sheetId}`        
      }


  @Post('create-worksheet/:validSpreadId')
  async createWorkingSheet(
      @Param('validSpreadId') validSpreadId:keyof typeof spreadSheetsId,
      @Body() workingSheet:WorksheetBasicProperties
    ){
      const workSheetCreated = await this.googleApiService.createWorkSheet(workingSheet,validSpreadId);
      return `google WorkSheet loaded correctly:  ${workSheetCreated.title}  with id: ${workSheetCreated.sheetId}`;       
  }

  @Post('copy-worksheet')
  async copySheet(
      @Body() sheetProperties:CopySheetDto
    ){
      const copySheet = await this.googleApiService.copyWorkSheet(sheetProperties)
      return `name changed, new name => ${copySheet.title}`
           
  }

  @Post('addRowItems')
  async setMasterTemp(
    
    @Query() sheetDto:GoogleSheetDto,
    @Body() rowProperties:CreateRows[]
   
    ){
      await this.googleApiService.setRowsSheet(rowProperties,sheetDto);
      return `items agregados => \n\n${JSON.stringify(rowProperties)  }  \n\n fueron agregados en el master template de:  ${sheetDto.spreadSheetId}`;
           
  }

  @Get('getRowsItems')
  async getRowsSheet(
    
    ){
      const masterTemplate = await this.googleApiService.getRowsSheet();
      return masterTemplate
  }

  @Patch('updateRowsItems')
  async updateRow(
    @Body() rowProperties:any
    ){
      const masterTemplate = await this.googleApiService.updateRowById(rowProperties.id, rowProperties);
      return masterTemplate
  }

  @Delete('deleteRowsItems')
  async deleteRow(
    @Body() rowProperties:UpdateRowDTO
    ){
      const masterTemplate = await this.googleApiService.deleteRowById(rowProperties.id);
      return masterTemplate
  }

  @Get('transferData')
  async trnsferData(
    @Query() sheetDto:GoogleSheetDto,
    ){
      const masterTemplate = await this.googleApiService.workSheetDataTransfer(sheetDto);
      return masterTemplate
  }

  @Delete('deleteAllRows')
  async deleteAllRow(
    @Body() rowIndexes: number[],
    @Query() sheetDto:GoogleSheetDto,
    ){
      const masterTemplate = await this.googleApiService.deleteRowsFromSheet(sheetDto);
      return masterTemplate
  }






  




















  

}
