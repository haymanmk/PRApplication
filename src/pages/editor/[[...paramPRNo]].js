import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { SettingsPRApplication } from "src/sections/purchase-request/settings-pr-application";
import { PRItemTable } from "src/sections/purchase-request/settings-item-table";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import { useGetPROptions } from "src/hooks/use-get-pr-options";
import { usePRInfo } from "src/hooks/use-pr-info";
import { useHandleChangePR } from "src/hooks/use-handle-change-pr";
import { PRFilesTable } from "src/sections/purchase-request/settings-files-table";

const Page = () => {
  const router = useRouter();
  const paramPRNo = router.query.paramPRNo?.[0];
  const cookies = useSelector((state) => state.cookies);
  const prOptions = useGetPROptions(cookies);
  const prInfo = usePRInfo({ paramPRNo, ...prOptions });
  const handleChange = useHandleChangePR({
    cookies,
    prInfo,
    prOptions,
  });

  return (
    <>
      <Head>
        <title>Editor | PR App</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Editor</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  startIcon={<SaveRoundedIcon />}
                  variant="contained"
                  onClick={handleChange.handleSaveClick}
                >
                  Save
                </Button>
                <Button
                  startIcon={<PlayCircleFilledRoundedIcon />}
                  variant="contained"
                  onClick={handleChange.handleSubmitClick}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
            <form>
              <Stack direction="column" spacing={3}>
                <SettingsPRApplication
                  prOptions={prOptions}
                  prInfo={prInfo}
                  handleChange={handleChange}
                />
                <PRItemTable
                  items={prInfo.purchaseItems}
                  category={prOptions.category}
                  total={prInfo.total}
                  handleAddNewItemClick={handleChange.handleAddNewItemClick}
                  handleItemInputChange={handleChange.handleItemInputChange}
                  handleCalculateTotal={handleChange.handleCalculateTotal}
                />
                <PRFilesTable
                  attachments={prInfo.attachments}
                  category={prOptions.attachmentCategory}
                  handleFileInputChange={handleChange.handleFileInputChange}
                  handleUploadFile={handleChange.handleUploadFile}
                />
              </Stack>
            </form>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
