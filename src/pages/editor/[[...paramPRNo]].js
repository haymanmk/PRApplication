import Head from "next/head";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useQueryPR } from "src/hooks/use-query-pr";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState, useRef } from "react";
import { QueryData } from "src/utils/pr/query-data";
import { SettingsPRApplication } from "src/sections/purchase-request/settings-pr-application";
import { PRItemTable } from "src/sections/purchase-request/settings-item-table";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import { initForm, prLineForm } from "src/utils/pr/save-all-init-form";
import { useGetPROptions } from "src/hooks/use-get-pr-options";
import { usePRInfo } from "src/hooks/use-pr-info";
import { useHandleChangePR } from "src/hooks/use-handle-change-pr";

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
                <Button disabled startIcon={<PlayCircleFilledRoundedIcon />} variant="contained">
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
                <Divider />
                <PRItemTable
                  items={prInfo.purchaseItems}
                  category={prInfo.category}
                  total={prInfo.total}
                  handleAddNewItemClick={handleChange.handleAddNewItemClick}
                  handleItemInputChange={handleChange.handleItemInputChange}
                  handleCalculateTotal={handleChange.handleCalculateTotal}
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
