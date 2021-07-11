import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function InputTable(props) {
  const classes = useStyles();
  const [numbers, setNumbers] = useState({});

  const getCurrentValues = () => {
    let nums = {};
    for (let row of props.rows) {
      let input = document.getElementById(row.name);
      nums[row.name] = Number(input.value);
    }
    setNumbers(nums);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell align="right">How much?</TableCell>
              <TableCell align="right">Unit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <TextField
                    id={row.name}
                    key={idx}
                    name={row.name}
                    label={row.name}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                    onChange={(event) => {
                      getCurrentValues();
                    }}
                    value={numbers[row.name] ? numbers[row.name] : ""}
                  />
                </TableCell>
                <TableCell align="right">{row.default_unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          window.localStorage.setItem("ingredients", JSON.stringify(numbers));
          props.handleSubmit(numbers);
        }}
      >
        update ingredients
      </Button>
    </>
  );
}
