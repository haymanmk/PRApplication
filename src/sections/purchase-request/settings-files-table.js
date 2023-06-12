import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Stack } from "@mui/system";
import { Scrollbar } from "src/components/scrollbar";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { useState, useCallback, useRef } from "react";
import { SettingsAutocomplete } from "./settings-autocomplete";
import { SelectFilesDialog } from "./settings-select-files";

export const PRFilesTable = (props) => {
  const [openSelectFilesDialog, setOpenSelectFilesDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { attachments, category = [], handleUploadFile } = props;

  const handleFileInputChange = useCallback((event) => {
    setSelectedFiles((prev) => [
      ...prev,
      ...Object.values(event.target.files).map((file) => ({
        attachment: file,
        category: category[0],
      })),
    ]);
  }, []);

  const handleFileCategoryChange = useCallback(
    (index, value) => {
      // console.log("Category changed to: ", value);
      const _selectedFiles = Object.assign([], selectedFiles);
      _selectedFiles[index]["category"] = value;
      setSelectedFiles(_selectedFiles);
    },
    [selectedFiles]
  );

  const handleOpenSelectFilesDialog = useCallback((_) => {
    setSelectedFiles([]);
    setOpenSelectFilesDialog(true);
  }, []);

  const handleCloseSelectFilesDialog = useCallback((_) => {
    setOpenSelectFilesDialog(false);
  }, []);

  const handleUploadButtonClicked = useCallback(() => {
    // console.log("selectedFiles: ", selectedFiles);
    handleUploadFile(selectedFiles);
  }, [selectedFiles]);

  return (
    <Card>
      <CardHeader title="Files" />
      <Divider />
      <CardContent container wrap="wrap">
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "50%" }}>File Name</TableCell>
                  <TableCell style={{ width: "50%" }}>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attachments?.map((file, index) => {
                  // console.log("file: ", file);
                  return (
                    <TableRow hover key={index}>
                      <TableCell>{file.attachment.name}</TableCell>
                      <TableCell>
                        <SettingsAutocomplete
                          value={file.category || category[0]}
                          onChange={(event, value) => {
                            handleAttachmentCategoryChange(index, value);
                          }}
                          options={category}
                          optionKeys={["filetypename"]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow hover>
                  {/* <input
                    id="btn-add-files"
                    type="file"
                    multiple
                    ref={chooseFileRef}
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  /> */}
                  <TableCell
                    align="center"
                    colSpan={2}
                    onClick={handleOpenSelectFilesDialog}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="center"
                      spacing={0.5}
                    >
                      <FolderRoundedIcon />
                      <span>ADD</span>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </CardContent>
      <SelectFilesDialog
        open={openSelectFilesDialog}
        selectedFiles={selectedFiles}
        category={category}
        handleFileInputChange={handleFileInputChange}
        handleFileCategoryChange={handleFileCategoryChange}
        handleClose={handleCloseSelectFilesDialog}
        handleUploadButtonClicked={handleUploadButtonClicked}
      />
    </Card>
  );
};
