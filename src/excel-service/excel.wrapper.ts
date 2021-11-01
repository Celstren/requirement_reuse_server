import { Workbook, Worksheet } from 'exceljs';
import { ExcelDTO } from './dto/excel.dto';
import { WorksheetDto } from './dto/worksheet.dto';
import {format} from "date-fns"

export class ExcelWrapper {
  private static DATETIME_FORMAT = "yyyyMMddHHmmss"
  private static MIMETYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  readonly workBook: Workbook;
  name: string;

  constructor(name: string) {
    this.workBook = new Workbook();
    this.name = name;
  }

  addWorkSheet(data: WorksheetDto) {
    const worksheet = this.workBook.addWorksheet(data.name);
    worksheet.columns = data.columns;
    data.rows.forEach((x) => worksheet.addRow(x));
    this.addTitleTable(worksheet,data.name,data.titleRange);
    
  }

  async getExcel() {
    const data = await this.workBook.xlsx.writeBuffer();
    return <ExcelDTO>{
      data,
      mimetype: ExcelWrapper.MIMETYPE,
      name: this.name,
    };
  }

  static build(name:string){
    name = `${name}${format(new Date(),ExcelWrapper.DATETIME_FORMAT)}`;
    return new ExcelWrapper(name);
  }

  static async load(filename:string,buffer:Buffer){
    const wrapper =  new ExcelWrapper(filename);
    await wrapper.workBook.xlsx.load(buffer);
    return wrapper;
  }

  private addTitleTable(ws:Worksheet, title:string, range:string ){
    ws.insertRow(1,[title])
    ws.getRow(1).getCell(1).style = {
      font:{
        bold:true
      },
      alignment:{vertical: 'middle', horizontal:'center'}
    } 
    ws.mergeCells(range)
  }
}
