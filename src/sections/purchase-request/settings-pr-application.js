import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { SettingsAutocomplete } from "./settings-autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { memo } from "react";

export const SettingsPRApplication = memo(({ prOptions, prInfo, handleChange }) => {
  const { userAccount, costCenter, costCenterLocation, location, vendor, project, diyProject } =
    prOptions;
  const {
    prNo,
    applicantInfo,
    applicationCostCenter,
    applicationShipTo,
    applicationVendor,
    applicationProject,
    applicationDIYProject,
    requiredDate,
    applicationReason,
    applicationDescription,
  } = prInfo;
  const {
    handleApplicantChange,
    handleApplicationCostCenterChange,
    handleApplicationShipToChange,
    handleApplicationVendorChange,
    handleVendorInputChange,
    handleApplicationProjectChange,
    handleApplicationDIYProjectChange,
    handleRequiredDateChange,
    handleReasonChange,
    handleDescriptionChange,
  } = handleChange;

  return (
    <Card>
      <CardHeader title="Common Info." subheader={"PR No.: " + prNo} />
      <Divider />
      <CardContent>
        <Grid container wrap="wrap" spacing={2}>
          <Grid item xs={12} sm={6}>
            <SettingsAutocomplete
              required
              id="input_applicant_name"
              value={applicantInfo}
              onChange={handleApplicantChange}
              options={userAccount}
              optionKeys={["empid", "displayNameC"]}
              textFieldLabel="Applicant"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SettingsAutocomplete
              required
              id="input_cost_center"
              value={applicationCostCenter}
              onChange={handleApplicationCostCenterChange}
              options={costCenter}
              optionKeys={["displayName"]}
              textFieldLabel="Cost Center"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SettingsAutocomplete
              required
              id="input_cost_center_location"
              // value={}
              defaultValue={{ orgCode: "不分廠" }}
              options={costCenterLocation}
              optionKeys={["orgCode"]}
              textFieldLabel="Cost Center Location"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingsAutocomplete
              required
              id="input_ship_to"
              value={applicationShipTo}
              onChange={handleApplicationShipToChange}
              options={location}
              optionKeys={["locationCode"]}
              textFieldLabel="Ship To"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingsAutocomplete
              required
              id="input_vendor"
              value={applicationVendor}
              onChange={handleApplicationVendorChange}
              onInputChange={handleVendorInputChange}
              options={vendor}
              optionKeys={["vendorName"]}
              textFieldLabel="Vendor"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingsAutocomplete
              required
              id="input_project"
              value={applicationProject}
              onChange={handleApplicationProjectChange}
              options={project}
              optionKeys={["projectName"]}
              textFieldLabel="Fin. Project"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SettingsAutocomplete
              required
              id="input_diy_project"
              value={applicationDIYProject}
              onChange={handleApplicationDIYProjectChange}
              options={diyProject}
              optionKeys={["displayValue"]}
              textFieldLabel="DIY Project"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Required-by Date"
                value={requiredDate}
                onChange={handleRequiredDateChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Stack direction="column" spacing={2}>
          <TextField
            required
            multiline
            fullWidth
            id="input_reason"
            label="Reason"
            value={applicationReason}
            onChange={handleReasonChange}
          />
          <TextField
            required
            multiline
            fullWidth
            id="input_description"
            label="Description"
            value={applicationDescription}
            onChange={handleDescriptionChange}
          />
        </Stack>
      </CardContent>
    </Card>
  );
});
