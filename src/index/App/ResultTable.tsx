import { useTransContext } from '@jellybrick/solid-i18next'
import { createSignal, JSX, For } from 'solid-js'
import {
  Box,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@suid/material'
import { ConvertedRow } from '../types'

interface ResultTableProps {
  limit?: number
  twoWay: () => boolean
  rows: () => ConvertedRow[]
  geographicCoordinates?: () => boolean
}

export default function ResultTable (props: ResultTableProps): JSX.Element {
  const [t] = useTransContext()
  const { rows, twoWay } = props
  const [showAll, setShowAll] = createSignal(false)
  const rowLimit = props.limit ?? 100
  const visibleRows = (): ConvertedRow[] => (showAll() ? rows() : rows().slice(0, rowLimit))

  if (rows().length === 0) {
    return <p>{t('emptyTable')}</p>
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {rows().length > rowLimit && (
        <Box
          sx={{
            alignItems: { sm: 'center', xs: 'stretch' },
            display: 'flex',
            flexDirection: { sm: 'row', xs: 'column' },
            gap: 1.5,
            justifyContent: 'space-between'
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showAll()}
                onChange={(_, value) => setShowAll(value)}
              />
            }
            label={showAll() ? t('showAll') : t('showFirst', { count: rowLimit })}
          />
          <div>{showAll() ? t('rowsShown', { count: rows().length }) : t('firstShown', { count: rowLimit })}</div>
        </Box>
      )}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 650, whiteSpace: 'nowrap' }} aria-label={t('resultsTable')}>
          <TableHead>
            <TableRow>
              <TableCell scope='col'>X</TableCell>
              <TableCell scope='col'>Y</TableCell>
              <TableCell scope='col'>lat</TableCell>
              <TableCell scope='col'>lng</TableCell>
              <TableCell scope='col'>{twoWay() ? 'x2' : 'lat dms'}</TableCell>
              <TableCell scope='col'>{twoWay() ? 'y2' : 'lng dms'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={visibleRows()}>
              {(row: ConvertedRow) => (
                <TableRow>
                  <TableCell>{props.geographicCoordinates?.() ? row.x : Number(row.x.toFixed(3))}</TableCell>
                  <TableCell>{props.geographicCoordinates?.() ? row.y : Number(row.y.toFixed(3))}</TableCell>
                  <TableCell>{row.lat}</TableCell>
                  <TableCell>{row.lng}</TableCell>
                  <TableCell>{twoWay() ? Number(row.x2.toFixed(3)) : row.latdms}</TableCell>
                  <TableCell>{twoWay() ? Number(row.y2.toFixed(3)) : row.lngdms}</TableCell>
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
