import {createSignal, JSX, For} from 'solid-js';
import {
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@suid/material';
import { ConvertedRow } from '../types';

interface ResultTableProps {
  rows: () => ConvertedRow[];
  twoWay: () => boolean;
  limit?: number;
}

export default function ResultTable(props: ResultTableProps): JSX.Element {
  const { rows, twoWay } = props;
  const [showAll, setShowAll] = createSignal(false);
  const rowLimit = props.limit ?? 100;

  if (rows().length === 0) {
    return <p>Inga data att visa.</p>;
  }

  return (
      <Stack spacing={2} direction="column">
        {rows().length > rowLimit && (
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                  control={
                    <Switch
                        checked={showAll()}
                        onChange={(_, value) => setShowAll(value)}
                    />
                  }
                  label={showAll() ? 'Visa alla rader' : 'Visa endast de 100 första raderna'}
              />
              {!showAll() && 'Nu visas endast de 100 första raderna här nedan'}
            </Stack>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, whiteSpace: 'nowrap' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell scope="col">X</TableCell>
                <TableCell scope="col">Y</TableCell>
                <TableCell scope="col">lat</TableCell>
                <TableCell scope="col">lng</TableCell>
                <TableCell scope="col">{twoWay() ? 'x2' : 'lat dms'}</TableCell>
                <TableCell scope="col">{twoWay() ? 'y2' : 'lng dms'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <For each={showAll() ? rows() : rows().slice(0, rowLimit)}>
                {(row: ConvertedRow) => (
                    <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                    >
                      <TableCell>{row.x}</TableCell>
                      <TableCell>{row.y}</TableCell>
                      <TableCell>{row.lat}</TableCell>
                      <TableCell>{row.lng}</TableCell>
                      <TableCell>{twoWay() ? row.x2 : row.latdms}</TableCell>
                      <TableCell>{twoWay() ? row.y2 : row.lngdms}</TableCell>
                    </TableRow>
                )}
              </For>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
  );
}
