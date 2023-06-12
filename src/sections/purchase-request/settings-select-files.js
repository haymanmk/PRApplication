import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SettingsAutocomplete } from "./settings-autocomplete";
import { useCallback, useRef, useState } from "react";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

export const SelectFilesDialog = (props) => {
  const chooseFileRef = useRef();
  const {
    open,
    selectedFiles,
    category,
    handleFileInputChange,
    handleFileCategoryChange,
    handleClose,
    handleUploadButtonClicked,
  } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select Files</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select uploaded files in the same folder and their categories.
        </DialogContentText>
        <br />
        <Scrollbar>
          <Box>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedFiles?.map((file, index) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell>{file.attachment.name}</TableCell>
                      <TableCell>
                        <SettingsAutocomplete
                          value={file.category || category[0]}
                          onChange={(event, value) => {
                            handleFileCategoryChange(index, value);
                          }}
                          options={category}
                          optionKeys={["filetypename"]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow hover>
                  <input
                    id="btn-add-files"
                    type="file"
                    multiple
                    ref={chooseFileRef}
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />
                  <TableCell
                    align="center"
                    colSpan={2}
                    onClick={(event) => chooseFileRef.current.click()}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.5}
                    >
                      <FolderRoundedIcon />
                      <span>Select Files</span>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={(event) => {
            handleUploadButtonClicked();
            handleClose();
          }}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
