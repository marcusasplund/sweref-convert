export interface CsvData {
  data: string | File
  isFile: boolean
}

export interface PapaParseResult {
  data: {
    x: number
    y: number
  }
}

export interface ConvertedRow {
  x: number
  y: number
  lat: number
  lng: number
  x2: number
  y2: number
  latdms: number
  lngdms: number
}
