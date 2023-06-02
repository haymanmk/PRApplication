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
import { useRef } from "react";
import { SettingsAutocomplete } from "./settings-autocomplete";

export const PRFilesTable = (props) => {
  const {
    attachments,
    category = [],
    handleFileInputChange,
    handleAttachmentCategoryChange,
  } = props;
  const chooseFileRef = useRef();

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
                  console.log("file: ", file);
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
                      <span>ADD</span>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
      </CardContent>
    </Card>
  );
};
