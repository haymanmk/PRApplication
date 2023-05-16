import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
} from "@mui/material";
import { format } from "date-fns";
import { Scrollbar } from "src/components/scrollbar";

const prStatus = {
  0: "Editing",
  1: "Submitting",
  2: "Approving",
  3: "Approved",
  4: "Rejected",
  5: "Cancelled",
  6: "Executed",
};

export const PRTable = (props) => {
  const {
    count = 0,
    items = [],
    onSelectAll,
    onSelectOne,
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) onSelectAll?.();
                      else onDeselectAll?.();
                    }}
                  />
                </TableCell>
                <TableCell>PR No.</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PO No.</TableCell>
                <TableCell>PO Apply Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Applicant</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((pr) => {
                const isSelected = selected.includes(pr.prHeaderId);
                const createdAt = format(new Date(pr.prCreationDate), "yyyy/MM/dd");

                return (
                  <TableRow hover key={pr.prHeaderId} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) onSelectOne?.(pr.prHeaderId);
                          else onDeselectOne?.(pr.prHeaderId);
                        }}
                      />
                    </TableCell>
                    <TableCell>{pr.prNo}</TableCell>
                    <TableCell>{prStatus[pr.status || 0]}</TableCell>
                    <TableCell>{pr.poNo}</TableCell>
                    <TableCell>{pr.poApplyDate}</TableCell>
                    <TableCell>{pr.reason}</TableCell>
                    <TableCell>{pr.vendor}</TableCell>
                    <TableCell>
                      {pr.currency}${pr.totalAmount}
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>{pr.applicant}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};
