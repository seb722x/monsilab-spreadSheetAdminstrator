import { BadRequestException, Injectable,  Logger } from '@nestjs/common';
import {  GoogleSheetDto } from './dto/sheets-Id.dto';
import {  GoogleSpreadsheet, GoogleSpreadsheetFormulaError, GoogleSpreadsheetWorksheet, WorksheetBasicProperties } from 'google-spreadsheet';
import { GoogleAuthProvider } from './google-auth/google-auth.provider';;
import { spreadSheetsId } from './interfaces/valid-id-spreadsheets.interface';
import { UpdateRowDTO } from './dto/update-rows.dto';
import { CopySheetDto } from './dto/copy-worksheet.dto';

@Injectable()
export class GoogleApiService {
  private workSheet:GoogleSpreadsheetWorksheet ;   // SHEET
  private spreadSheet:GoogleSpreadsheet;  // BOOK

  private readonly logger = new Logger('ProductsService');

  constructor(
    
    private readonly googleAuth:GoogleAuthProvider
  ){}


 
  async getSpreadSheet(spreadSheetId: keyof typeof spreadSheetsId){
    try {
      const actualSpreadId = spreadSheetsId[spreadSheetId];
      const spreadSheet:GoogleSpreadsheet = await this.authGoogleSpreadsheet(actualSpreadId);
      return spreadSheet;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async loadMemoSpreadSheet(spreadSheetId: keyof typeof spreadSheetsId){
    const spreadSheet:GoogleSpreadsheet = await this.getSpreadSheet(spreadSheetId);
    return this.spreadSheet = spreadSheet;
  }
  

  findWorkSheetbyId(spreadSheet:GoogleSpreadsheet,workSheetId:string){
    try{
      return spreadSheet.sheetsById[workSheetId];

    }catch (error){
      this.handleDBExceptions(error);
    }
  }

  async getWorkSheet(googlesheetDto:GoogleSheetDto):Promise<GoogleSpreadsheetWorksheet>
  {
    try {
      const {spreadSheetId,workSheetId} = googlesheetDto;
      const loadSpreadSheet = await this.getSpreadSheet(spreadSheetId);
      const workSheet =  this.findWorkSheetbyId(loadSpreadSheet,workSheetId);
      return  workSheet;   

    } catch (error){
      this.handleDBExceptions(error);
    }
  }
    
  async loadMemoWorkSheet(sheetDto:GoogleSheetDto){
    const loadworkSheet = await this.getWorkSheet(sheetDto);
    return this.workSheet = loadworkSheet;
  }

  


  async createWorkSheet(properties:WorksheetBasicProperties,validSpreadId:keyof typeof spreadSheetsId)
  {
    try{
      const spreadSheet = await this.getSpreadSheet(validSpreadId);
      return await spreadSheet.addSheet({
          title: properties.title, 
          //!!!TODO  WorksheetBasicProperties:
          })
    }catch (error){
      this.handleDBExceptions(error);
    } 
  }

  

  async copyWorkSheet(copySheetDto:CopySheetDto) //!Modify tipo
  { 
    try {
      const {spreadSheetId,workSheetTitle} = copySheetDto;
      const templateSheet = this.workSheet;
      const getSpreadSheetId = this.getSpreadSheetIdByName(spreadSheetId)
      const workSheetCopy:any = await templateSheet.copyToSpreadsheet(getSpreadSheetId);
        console.log(workSheetCopy.data.title);
      const newWorkSheetId = workSheetCopy.data.sheetId;
        console.log(newWorkSheetId);
      return this.changeTitleWorkSheet(newWorkSheetId,spreadSheetId,workSheetTitle);

    } catch (error){
      this.handleDBExceptions(error);
    }
  }

  async changeTitleWorkSheet(workSheetId:string, spreadId:keyof typeof spreadSheetsId,workTitle:string){
    try{
      const SpreadSheet = await this.getSpreadSheet(spreadId);
      const WorkSheet =  this.findWorkSheetbyId(SpreadSheet, workSheetId);
      await WorkSheet.updateProperties({ title: workTitle })
      return this.findWorkSheetbyId(SpreadSheet, workSheetId);

    }catch (error){
      this.handleDBExceptions(error);
    }
  }
  //const targetValidIdMT = "ingredients"
  //const foundIngredient = ingredients.map(ingredient => ingredient.validIdMT === targetValidIdMT);

  async setRowsSheet(rowProperties:any,spreadType:GoogleSheetDto){
    try{
      const {spreadSheetId,workSheetId} = spreadType;
      const spreadSheet = await this.getSpreadSheet(spreadSheetId);
      const workSheet = this.findWorkSheetbyId(spreadSheet,workSheetId);
      await this.insertRow(workSheet,rowProperties);

    }catch (error){
      this.handleDBExceptions(error);
    }
    
    
  };

  async getRowsSheet(){
    try {
      
      const workSheet = this.workSheet;
      const rows = await workSheet.getRows();
      const rowData = rows.map(row => {
        const keys = row._sheet.headerValues;
        const values = row._rawData;
        const transformedRow = {};

        for (let i = 0; i < keys.length; i++) {
          transformedRow[keys[i]] = values[i];
        }

      return transformedRow;
      });

    console.log(rowData);
    return rowData;

    } catch (error){
      this.handleDBExceptions(error);
    }
  }

  async updateRowById(rowId: string , newData: UpdateRowDTO[] ) {
    try {
      const {rowIndex,rows } = await this.findInRowByIndex(rowId)
  
      if (rowIndex !== -1) {
        const row = rows[rowIndex];
        Object.assign(row, newData);
        await row.save();
        console.log(`Fila con ID ${rowId} actualizada correctamente.`);
      } else {
        console.log(`No se encontró ninguna fila con ID ${rowId}.`);
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteRowById(rowId: string): Promise<void> {
    try {
      
      const {rowIndex,rows } = await this.findInRowByIndex(rowId)
      

      if (rowIndex !== -1) {
        const row = rows[rowIndex];
        await row.delete();
        console.log(`Fila con ID ${rowId} eliminada correctamente.`);
      } else {
        console.log(`No se encontró ninguna fila con ID ${rowId}.`);
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteRowsFromSheet(spreadType: GoogleSheetDto) {
    try {
      const { spreadSheetId, workSheetId } = spreadType;
      const spreadSheet = await this.getSpreadSheet(spreadSheetId);
      const workSheet = this.findWorkSheetbyId(spreadSheet, workSheetId);
      await workSheet.loadCells();
      
      const rowCount = workSheet.rowCount;// Obtener el número total de filas y columnas
      const columnCount = workSheet.columnCount;
      
      for (let row = 1; row < rowCount; row++) {  // Iterar sobre todas las filas, excepto la primera (encabezados)
        for (let column = 0; column < columnCount; column++) {
          const cell = workSheet.getCell(row, column);
          cell.value = null; // Borrar el contenido de la celda
        }
      }
      await workSheet.saveUpdatedCells();
  
      console.log('Contenido de las celdas eliminado con éxito.');
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }



  async deleteAllRowsSheet(rowIndexes: number[], spreadType: GoogleSheetDto) {
    try {
      const { spreadSheetId, workSheetId } = spreadType;
      const spreadSheet = await this.getSpreadSheet(spreadSheetId);
      const workSheet = this.findWorkSheetbyId(spreadSheet, workSheetId);
      
      // Obtener las filas a eliminar
      const rowsToDelete = await workSheet.getRows({
        offset: 1, // Opcional: ajusta el desplazamiento según tus necesidades
        limit: 20, // Opcional: ajusta el límite según tus necesidades
      });
  
      // Filtrar las filas a eliminar según los índices proporcionados
      const rowsToDeleteFiltered = rowsToDelete.filter((row, index) => rowIndexes.includes(index + 1));
  
      // Eliminar las filas
      await Promise.all(rowsToDeleteFiltered.map(row => row.delete()));
  
      console.log('Filas eliminadas con éxito.');
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  
  async setProductionOrder(){







    
  }












  private async findInRowByIndex(rowId: string){
     const workSheet = this.workSheet;
     const rows = await workSheet.getRows();
     const rowIndex = rows.findIndex(row => row.id === rowId);
     return {rowIndex,rows };

  }

  private getSpreadSheetIdByName = (spreadSheetName: string): string | undefined => {
    const spreadSheetEntries = Object.entries(spreadSheetsId);
    for (const [name, id] of spreadSheetEntries) {
      if (name === spreadSheetName) {
        return id;
      }
    }
    return undefined; // Si no se encuentra el nombre, devuelve undefined
  };
   

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error);
    throw new GoogleSpreadsheetFormulaError(error);

  }

  private  async authGoogleSpreadsheet(sheetId:string){
    try{
     const loadSpreadSheet:GoogleSpreadsheet = new GoogleSpreadsheet(sheetId);
     const spreadAuthSheet = await this.googleAuth.useAccountAuth(loadSpreadSheet);
     await spreadAuthSheet.loadInfo();
     return  spreadAuthSheet

    } catch (error){
      this.handleDBExceptions(error);
    }
  }

  private async insertRow(workSheet:GoogleSpreadsheetWorksheet,rows: any[]){
    try {
      const rowData: any[] = []; // Arreglo para almacenar los datos de cada fila
      //  Recorrer las propiedades y almacenar los datos de cada fila
      for (const row of rows) {
        const keys = Object.keys(row); // Obtener los nombres de las propiedades del objet 
        const maxLength = Math.max(...keys.map(key => Array.isArray(row[key]) ? row[key].length : 1));// Encontrar la propiedad con el array más largo
        const rowDataItem: any = {}; // Crear un objeto para representar cada fila
        // Iterar sobre las propiedades y asignar los valores a la fila
        for (let i = 0; i < maxLength; i++) {
          for (const prop of keys) {
            const value = row[prop];
            if (Array.isArray(value)) {
              // Insertar el valor del array en la fila correspondiente, o un espacio en blanco si no hay más elementos
              rowDataItem[prop] = i < value.length ? value[i] : "";
            } else {
              rowDataItem[prop] = value;
            }
          }
          // Agregar la fila completa al arreglo de datos de filas
          rowData.push(Object.assign({}, rowDataItem));
        }
      }
      //  Insertar los datos de todas las filas en la hoja de cálculo
      await workSheet.addRows(rowData);

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  

    async workSheetDataTransfer(spreadType:GoogleSheetDto){
      
      const rows = await this.getRowsSheet();
      console.log(rows)
      await this.setRowsSheet(rows, spreadType);
      console.log('Transferencia de datos exitosa');


  }

  


  private async insermuestratRow(workSheet:GoogleSpreadsheetWorksheet,rows:{}[]){
    try {
      for (const row of rows) {
        await workSheet.addRow(row);
      }
      //!!TODO Tabs design
    } catch (error) {
      this.handleDBExceptions(error);
    }
   
  }

  async downloadWorksheet() {
    const worksheet = this.workSheet; // Obtén la hoja de cálculo en la que deseas trabajar
    return worksheet
   
  
    }









    
  }
  






























  


