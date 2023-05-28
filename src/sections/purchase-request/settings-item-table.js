import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SettingsAutocomplete } from "./settings-autocomplete";
import { useCallback, useRef } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export const PRItemTable = (props) => {
  const {
    items,
    category,
    total,
    handleAddNewItemClick,
    handleItemInputChange,
    handleCalculateTotal,
  } = props;
  const setTimeoutID_calculateTotal = useRef();

  const handleIntegerInputChange = useCallback((rowID, newValue) => {
    Object.entries(newValue).map(([key, value]) => {
      value = value.replace(/[^0-9]/g, "");
      value = value.replace(/^0+(?=\d)/g, "");

      handleItemInputChange(rowID, { [key]: value });
    });
  }, []);

  const handleFloatInputChange = useCallback((rowID, newValue) => {
    Object.entries(newValue).map(([key, value]) => {
      value = value.replace(/[^0-9.]/g, "");
      value = value.replace(/^0+(?=\d)/g, "");
      value = value.replace(/\.+(?=\.)/g, "");
      value = value.replace(/\.*(\.\d+)\.+/g, "$1");

      handleItemInputChange(rowID, { [key]: value });
    }, []);
  }, []);

  const handleSummation = useCallback(
    (rowID, row) => {
      clearTimeout(setTimeoutID_calculateTotal.current);
      setTimeoutID_calculateTotal.current = setTimeout(() => {
        handleCalculateTotal();
      }, 2000);
      handleItemInputChange(rowID, {
        sum: (Number(row.quantity) * Number(row.unitPrice)).toFixed(2),
      });
    },
    [items]
  );

  return (
    <Card>
      <CardHeader title="Items" />
      <Divider />
      <CardContent container wrap="wrap">
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "20%" }}>Category</TableCell>
                  <TableCell style={{ width: "20%" }}>Spec.</TableCell>
                  <TableCell style={{ width: "20%" }}>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(items)?.map(([key, row]) => {
                  //   const row = items[key];
                  return (
                    <TableRow hover key={key}>
                      <TableCell>
                        <SettingsAutocomplete
                          defaultValue={{ displayName: "09-01. consumption materials" }}
                          value={row.category}
                          onChange={(event, newValue) => {
                            handleItemInputChange(key, { category: newValue });
                          }}
                          options={category}
                          optionKeys={["displayName"]}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          multiline
                          value={row.spec}
                          onChange={(event) => {
                            handleItemInputChange(key, { spec: event.target.value });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          multiline
                          value={row.description}
                          onChange={(event) => {
                            handleItemInputChange(key, { description: event.target.value });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row.quantity}
                          onChange={(event) => {
                            handleIntegerInputChange(key, { quantity: event.target.value });
                          }}
                          onBlur={() => {
                            if (!items[key].quantity) handleItemInputChange(key, { quantity: 0 });
                            handleSummation(key, row);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          value={row.unitPrice}
                          onChange={(event) => {
                            handleFloatInputChange(key, { unitPrice: event.target.value });
                          }}
                          onBlur={(event) => {
                            const float = parseFloat(event.target.value);
                            if (!float) handleItemInputChange(key, { unitPrice: 0 });
                            else handleItemInputChange(key, { unitPrice: float });
                            handleSummation(key, row);
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.sum}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow hover>
                  <TableCell
                    align="center"
                    colSpan={6}
                    onClick={handleAddNewItemClick}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="center">
                      <AddRoundedIcon />
                      <span>NEW</span>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={3} colSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="right">{ccyFormat(total.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Tax</TableCell>
                  <TableCell align="right">{ccyFormat(total.tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">{ccyFormat(total.total)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};

function ccyFormat(num) {
  return `${Number(num)?.toFixed(2)}`;
}
