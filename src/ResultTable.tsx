import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Switch
} from '@suid/material'
import { createSignal, mapArray, JSX } from 'solid-js'
import { ConvertedRow } from './App'

interface Props {
  rows: () => ConvertedRow[]
  twoWay: () => boolean
}

export default function ResultTable (props: Props): JSX.Element {
  const { rows, twoWay } = props
  const [showAll, setShowAll] = createSignal(false)

  return (
    <Stack spacing={2} direction='column'>
      {
            rows().length > 100 &&
              <Stack spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAll()}
                      onChange={(event, value) => {
                        setShowAll(value)
                      }}
                    />
  }
                  label={showAll() ? 'Visa alla rader' : 'Visa endast de 100 första raderna'}
                />
                {!showAll() && 'Nu visas endast de 100 första raderna här nedan'}
              </Stack>
          }
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, whiteSpace: 'nowrap' }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>X</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>lat</TableCell>
              <TableCell>lng</TableCell>
              <TableCell>{twoWay() ? 'x2' : 'lat dms'}</TableCell>
              <TableCell>{twoWay() ? 'y2' : 'lng dms'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {mapArray(
                () => showAll() ? rows() : rows().slice(0, 100),
                (row: ConvertedRow) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.x}</TableCell>
                    <TableCell>{row.y}</TableCell>
                    <TableCell>{row.lat}</TableCell>
                    <TableCell>{row.lng}</TableCell>
                    <TableCell>{twoWay() ? row.x2 : row.latdms}</TableCell>
                    <TableCell>{twoWay() ? row.y2 : row.lngdms}</TableCell>
                  </TableRow>
                )
              )}
            </>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
