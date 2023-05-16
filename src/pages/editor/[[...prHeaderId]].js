import Head from "next/head";
import { Box, Container, Stack, Typography } from "@mui/material";
import { SettingsNotifications } from "src/sections/settings/settings-notifications";
import { SettingsPassword } from "src/sections/settings/settings-password";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useQueryPR } from "src/hooks/use-query-pr";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Page = () => {
  const prList = useSelector((state) => state.pr_info.pr_list);
  const router = useRouter();
  const prHeaderId = router.query.prHeaderId;
  const prNum = prHeaderId ? prList[prHeaderId] : undefined;

  console.log(prHeaderId, prNum);

  let prInfo = useQueryPR(prNum);
  console.log(prInfo);

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
            <Typography variant="h4">Editor</Typography>
            <SettingsNotifications />
            <SettingsPassword />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
