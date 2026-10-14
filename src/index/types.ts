export interface CsvData {
  isFile: boolean
  data: string | File
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
  x2: number
  y2: number
  lat: number
  lng: number
  latdms: string
  lngdms: string
}

export interface ProjectionParams {
  axis: number
  scale: number
  flattening: number
  latOfOrigin: number
  falseEasting: number
  falseNorthing: number
  centralMeridian: number | null
}

export interface GridCoordinates {
  x: number
  y: number
}

export interface GeodeticCoordinates {
  lat: number
  lng: number
}
