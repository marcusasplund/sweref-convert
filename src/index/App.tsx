import { useTransContext } from '@jellybrick/solid-i18next'
import { createEffect, createSignal, JSXElement, lazy, Suspense } from 'solid-js'

import styled from '@suid/material/styles/styled'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@suid/material'

import InfoDialog from './App/InfoDialog'
import ResultTable from './App/ResultTable'
import TopBar from './App/TopBar'
import { selectParams } from './App/selectParams'

import * as Papa from 'papaparse'
import { ConvertedRow, CsvData, PapaParseResult } from './types'

import { convertRow } from './App/conversionLogic'
import { ProjectionKey } from './App/projectionParams'

const LeafletMap = lazy(async () => {
  const module = await import('./App/LeafletMap')
  return { default: module.LeafletMap }
})

const FileInput = styled('input')({
  display: 'none'
})

export default function App (): JSXElement {
  const [t] = useTransContext()
  const [open, setOpen] = createSignal(false)
  const [from, setFrom] = createSignal<ProjectionKey>('rt9025gonV')
  const [to, setTo] = createSignal<ProjectionKey>('wgs84')
  const [rows, setRows] = createSignal<ConvertedRow[]>([])
  const [viewMap, setViewMap] = createSignal(false)
  const [csvData, setCsvData] = createSignal<CsvData | null>(null)
  const [isDisabled, setIsDisabled] = createSignal(true)
  const [twoWay, setTwoWay] = createSignal(false)
  const [conversionChanged, setConversionChanged] = createSignal(false)

  const isTest = process.env.NODE_ENV === 'test'

  const handleChangeFrom = (value: ProjectionKey): void => {
    setFrom(value)
    setConversionChanged(true)
  }

  const handleChangeTo = (value: ProjectionKey): void => {
    setTo(value)
    setConversionChanged(true)
  }

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClickClose = (): void => {
    setOpen(false)
  }

  const toggleMap = (): void => {
    setViewMap(!viewMap())
  }

  const processCsvData = (data: CsvData): void => {
    let headers: string[] = []
    // @ts-expect-error Papa.parse overloads cannot express a string-or-File input with a dynamic download flag.
    Papa.parse(data.data, {
      complete: () => setViewMap(false),
      download: data.isFile,
      header: true,
      step: (results: PapaParseResult) => {
        if (headers.length === 0) {
          headers = Object.keys(results.data)
          if (headers.length < 2) {
            console.error('CSV does not have enough columns')
            return
          }
        }
        const rowData = results.data as Record<string, unknown>
        const convertedRow = convertRow(rowData[headers[0]] as number, rowData[headers[1]] as number, from(), to())
        setRows((prevRows) => [...prevRows, convertedRow])
      }
    })
  }

  const downloadCSV = (e: Event): void => {
    if ('preventDefault' in e) e.preventDefault()
    const parsed: string = Papa.unparse(rows(), {
      delimiter: ';'
    })
    const BOM: string = '\uFEFF'
    const blob = new Blob([BOM + parsed], { type: 'text/csv;charset=utf-8;' })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  createEffect(() => {
    const data = csvData()
    if (data != null) {
      setRows([])
      processCsvData(data)
    }
  })

  createEffect(() => {
    if (conversionChanged()) {
      const currentFrom = from()
      const currentTo = to()
      const convertedData = rows().map(row => convertRow(+row.x, +row.y, currentFrom, currentTo))
      setRows(convertedData)
      setConversionChanged(false)
    }
  })

  createEffect(() => {
    const hasMultipleRows = rows().length > 0
    setIsDisabled(!hasMultipleRows)
  })

  createEffect(() => {
    const istwoWay = from() !== 'wgs84' && to() !== 'wgs84'
    setTwoWay(istwoWay)
  })

  const parseFile = (e: Event): void => {
    const target = e.target as HTMLInputElement
    if ((target.files != null) && target.files.length > 0) {
      setCsvData({ data: target.files[0], isFile: false })
    }
  }

  const parseString = (e: Event): void => {
    const target = e.target as HTMLInputElement
    setCsvData({ data: target.value, isFile: false })
  }

  const parseRemote = (e: Event): void => {
    const target = e.target as HTMLInputElement
    setCsvData({ data: target.value, isFile: true })
  }

  const rowCount = () => rows().length

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <TopBar handleClickOpen={handleClickOpen} />
      <Box
        sx={{
          backgroundImage:
            'radial-gradient(circle at top left, rgba(29, 78, 216, 0.08), transparent 28%), radial-gradient(circle at 92% 12%, rgba(15, 118, 110, 0.06), transparent 20%)',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          px: { sm: 2, xs: 1 },
          py: { sm: 2, xs: 1 }
        }}
      >
        <Box sx={{ maxWidth: '76rem', mx: 'auto' }}>
          <Grid container alignItems='end' spacing={2} sx={{ pb: { sm: 1.5, xs: 1 } }}>
            <Grid item xs={12} sm={8}>
              <Typography component='h1' variant='h4' sx={{ m: 0, textWrap: 'balance' }}>
                {t('heading')}
              </Typography>
              <Typography variant='body1' sx={{ color: 'text.secondary', maxWidth: '68ch', mt: 1, textWrap: 'pretty' }}>
                {t('intro')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant='body2' sx={{ color: 'text.secondary', textAlign: { sm: 'right', xs: 'left' } }}>
                {rowCount() > 0 ? t('rowsLoaded', { count: rowCount() }) : t('summary')}
              </Typography>
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { sm: 2.5, xs: 2 } }}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='from-select-label'>Konvertera från</InputLabel>
                    <Select
                      labelId='from-select-label'
                      value={from()}
                      label={t('from')}
                      onChange={({ target }) => handleChangeFrom(target.value)}
                    >
                      {
                        selectParams.map((p) => (
                          <MenuItem value={p.value}>{p.value === 'rt9025gonV' ? t('nationalProjection') : p.text}</MenuItem>)
                        )
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='to-select-label'>Konvertera till</InputLabel>
                    <Select
                      labelId='to-select-label'
                      value={to()}
                      label={t('to')}
                      onChange={({ target }) => handleChangeTo(target.value)}
                    >
                      {
                        selectParams.map((p) => (
                          <MenuItem value={p.value}>{p.value === 'rt9025gonV' ? t('nationalProjection') : p.text}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box component='label' sx={{ display: 'block', width: '100%' }}>
                    <FileInput
                      accept='.csv'
                      id='contained-button-file'
                      multiple
                      type='file'
                      onChange={parseFile}
                    />
                    <Button variant='contained' component='span' fullWidth>
                      {t('upload')}
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button onClick={toggleMap} disabled={isDisabled()} variant='outlined' fullWidth>
                    {viewMap() ? t('tableView') : t('mapView')}
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button onClick={downloadCSV} disabled={isDisabled()} variant='contained' fullWidth>
                    {t('download')}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label={t('url')}
                      variant='outlined'
                      onInput={e => parseRemote(e)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      label={t('paste')}
                      variant='outlined'
                      multiline
                      rows={6}
                      onInput={e => parseString(e)}
                      fullWidth
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {viewMap() && rows().length > 0 && (isTest ? <Box id='map' sx={{ mt: 2 }} /> : (
                <Box sx={{ mt: 2 }}>
                  <Suspense fallback={<Box id='map' sx={{ height: '300px' }} />}>
                    <LeafletMap rows={rows} />
                  </Suspense>
                </Box>
              ))}
              {!viewMap() && rows().length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <ResultTable twoWay={twoWay} rows={rows} />
                </Box>
              )}
              {rows().length === 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='body1'>
                    {t('emptyResult')}
                  </Typography>
                </Box>
              )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <InfoDialog open={open} onClose={handleClickClose} />
    </Box>
  )
}
