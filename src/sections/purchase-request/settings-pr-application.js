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
import { useCallback, useState } from "react";
import { SettingsAutocomplete } from "./settings-autocomplete";
import { PRItemTable } from "./settings-item-table";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const SettingsPRApplication = (props) => {
  const [inputValue, setInputValue] = useState();
  const {
    prNo,
    applicantInfo,
    userAccount,
    handleApplicantChange,
    applicationCostCenter,
    costCenter,
    costCenterLocation,
    applicationShipTo,
    location,
    applicationVendor,
    vendor,
    handleApplicationVendorChange,
    handleVendorInputChange,
    applicationProject,
    project,
    applicationDIYProject,
    diyProject,
    requiredDate,
    handleRequiredDateChange,
    applicationReason,
    applicationDescription,
    purchaseItems,
    handleAddNewItemClick,
    handleItemInputChange,
    total,
    handleCalculateTotal,
    category,
  } = props;

  // console.log(costCenterLocation);
  const handleSubmit = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={3}>
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
              />
              <TextField
                required
                multiline
                fullWidth
                id="input_description"
                label="Description"
                value={applicationDescription}
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Items" />
          <Divider />
          <CardContent container wrap="wrap">
            <PRItemTable
              items={purchaseItems}
              handleAddNewItemClick={handleAddNewItemClick}
              handleItemInputChange={handleItemInputChange}
              total={total}
              handleCalculateTotal={handleCalculateTotal}
              category={category}
            />
          </CardContent>
        </Card>
      </Stack>
    </form>
  );
};

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option) => option.empid + option.displayNameC,
});
