import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import { useGetCookies } from "src/hooks/use-get-cookies";
import { useGetPRList } from "src/hooks/use-list-pr";
import { useSelector } from "react-redux";
import { PRSearch } from "src/sections/purchase-request/pr-search";
import { PRTable } from "src/sections/purchase-request/pr-table";

let data = [];

const usePRData = (data, page, rowsPerPage) => {
  return useMemo(() => {
    if (data.length) return applyPagination(data, page, rowsPerPage);
    else return [];
  }, [data.length, page, rowsPerPage]);
};

const usePRIds = (PRs) => {
  return useMemo(() => {
    return PRs.map((pr) => pr.prHeaderId);
  }, [PRs]);
};

const Page = () => {
  data = useSelector((state) => state.pr_info.pr_list);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const PRs = usePRData(data, page, rowsPerPage);
  const PRsIds = usePRIds(PRs);
  const PRsSelection = useSelection(PRsIds);

  useGetCookies();
  useGetPRList();

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>List | PR App</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">PR List</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <PRSearch />
            {
              <PRTable
                count={data.length}
                items={PRs}
                onDeselectAll={PRsSelection.handleDeselectAll}
                onDeselectOne={PRsSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={PRsSelection.handleSelectAll}
                onSelectOne={PRsSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={PRsSelection.selected}
              />
            }
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
