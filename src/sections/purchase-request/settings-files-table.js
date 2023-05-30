import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Input,
  InputBase,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Scrollbar } from "src/components/scrollbar";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { useRef } from "react";

export const PRFilesTable = (props) => {
  const { files, handleAddFilesClick } = props;
  const chooseFileRef = useRef();

  return (
    <Card>
      <CardHeader title="Files" />
      <Divider />
      <CardContent container wrap="wrap">
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <TableHead>
              <TableCell>File Name</TableCell>
              <TableCell>Category</TableCell>
            </TableHead>
            <TableBody>
              {files?.length &&
                files.map((file, index) => {
                  return (
                    <TableRow hover key={file.id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>{file.category}</TableCell>
                    </TableRow>
                  );
                })}
              <TableRow hover>
                <input
                  id="btn-add-files"
                  type="file"
                  ref={chooseFileRef}
                  style={{ display: "none" }}
                />
                <TableCell
                  align="center"
                  colSpan={2}
                  onClick={(event) => chooseFileRef.current.click()}
                  sx={{ cursor: "pointer" }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="center">
                    <FolderRoundedIcon />
                    <span>Add</span>
                  </Stack>
                </TableCell>
              </TableRow>
            </TableBody>
          </Box>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};
