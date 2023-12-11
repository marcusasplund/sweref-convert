import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@suid/material";
  import { mapArray } from "solid-js";
  
  export default function ResultTable(props) {
    const {rows} = props

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>X</TableCell>
              <TableCell>Y</TableCell>
              <TableCell>lat</TableCell>
              <TableCell>lng</TableCell>
              <TableCell>lat dms</TableCell>
              <TableCell>lng dms</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapArray(
              () => rows(),
              (row) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.x}
                  </TableCell>
                  <TableCell>{row.y}</TableCell>
                  <TableCell>{row.lat}</TableCell>
                  <TableCell>{row.lng}</TableCell>
                  <TableCell>{row.latdms}</TableCell>
                  <TableCell>{row.lngdms}</TableCell>            
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  