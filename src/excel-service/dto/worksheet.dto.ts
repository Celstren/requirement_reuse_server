interface WorksheetColumn {
  header: string;
  key: string;
}

export interface WorksheetDto {
  columns: WorksheetColumn[];
  rows: Record<string, any>[];
  name: string;
  titleRange:string
}
