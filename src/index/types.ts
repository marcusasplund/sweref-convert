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
  latdms: string
  lngdms: string
}

export interface ProjectionParams {
  axis: number
  flattening: number
  centralMeridian: number | null
  latOfOrigin: number
  scale: number
  falseNorthing: number
  falseEasting: number
}

export interface GridCoordinates {
  x: number
  y: number
}

export interface GeodeticCoordinates {
  lat: number
  lng: number
}
