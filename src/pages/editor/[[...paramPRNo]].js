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
import { useCommonInfo } from "src/hooks/use-common-info";

const Page = () => {
  const router = useRouter();
  const paramPRNo = router.query.paramPRNo?.[0];
  const cookies = useSelector((state) => state.cookies);
  const [purchaseItems, setPurchaseItems] = useState({});
  const [total, setTotal] = useState({ subtotal: 0, tax: 0, total: 0 });
  const prOptions = useGetPROptions(cookies);
  const commonInfo = useCommonInfo(prOptions);

  const setTimeoutID_vendorInput = useRef();

  const handleSaveClick = useCallback(
    (event) => {
      const url = "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrSaveAll.action";
      const formData = new URLSearchParams();

      formData.append("requestText");

      const body = {
        url: url,
        headers: {
          Cookie: cookies,
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formData.toString(),
      };
      QueryData(JSON.stringify(body))
        .then((res) => {
          const _data = res.rows;
          setVendor(_data);
        })
        .catch((err) => console.error(err));
    },
    [cookies]
  );

  const handleRequiredDateChange = useCallback((date) => {
    // console.log(date);
    setRequiredData(date);
  }, []);

  const handleApplicationVendorChange = useCallback((event, value) => {
    setApplicationVendor(value);
  }, []);

  const handleVendorInputChange = useCallback(
    (event, value) => {
      if (!value) return;
      const _dc = Date.now();

      const url = "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryVendor.action?_dc=" + _dc;
      const formData = new URLSearchParams();

      formData.append("sourceType", "PR");
      formData.append("ouId", "86");
      formData.append("userInput", value);

      const body = {
        url: url,
        headers: {
          Cookie: cookies,
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: formData.toString(),
      };
      clearTimeout(setTimeoutID_vendorInput);
      setTimeoutID_vendorInput.current = setTimeout(() => {
        QueryData(JSON.stringify(body))
          .then((res) => {
            const _data = res.rows;
            setVendor(_data);
          })
          .catch((err) => console.error(err));
      }, 1000);
    },
    [cookies]
  );

  const _id = useRef(Math.random().toString().substring(2, 8));
  const handleAddNewItemClick = useCallback((event) => {
    // console.log(purchaseItems);
    setPurchaseItems((prev) => ({
      ...prev,
      [_id.current]: {
        category: { displayName: "09-01. consumption materials" },
        spec: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
      },
    }));
    _id.current++;
  }, []);

  const handleItemInputChange = useCallback((rowID, newValue) => {
    setPurchaseItems((prev) => ({
      ...prev,
      [rowID]: { ...prev[rowID], ...newValue },
    }));
  }, []);

  const handleCalculateTotal = useCallback(() => {
    console.log("calculate total: ", purchaseItems);
    if (Object.keys(purchaseItems).length) {
      console.log("calculate: ", purchaseItems);
      const subtotal = Object.values(purchaseItems).reduce(
        (prev, current) => prev + Number(current.quantity) * Number(current.unitPrice),
        0
      );
      const taxRate = 0.05;
      let tax = 0;
      let total = 0;

      if (Object.values(applicationVendor).length) {
        const _dc = Math.random().toString().substring(2, 10);
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/GetSubtotalToTotalAndTax.action?_dc=" +
          _dc;

        const formData = new URLSearchParams();
        formData.append("amount", subtotal.toString());
        formData.append("currencyCode", vendor.currency);
        formData.append("taxCodeId", vendor.taxCodeId);
        formData.append("roundingRule", vendor.roundingRule);

        const body = {
          url: url,
          headers: {
            Cookie: cookies,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: formData.toString(),
        };
        QueryData(JSON.stringify(body))
          .then((res) => {
            const _data = res.rows;
            tax = _data.tax;
            total = _data.price;
          })
          .catch((err) => console.error(err));
      } else {
        tax = (subtotal * taxRate).toFixed(2);
        total = subtotal * (1 + taxRate).toFixed(2);
        console.log({ subtotal, tax, total });
      }
      setTotal((prev) => ({ ...prev, ...{ subtotal, tax, total } }));
    }
  }, [cookies, purchaseItems, applicationVendor]);

  const handleApplicantChange = useCallback((event, value) => {
    console.log("new applicant: ", value);
    setApplicantInfo(value);
  }, []);

  const handleCostCenterChange = useCallback((event, value) => {
    console.log("new cost center: ", value);
    setCostCenter(value);
  }, []);

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
                  onClick={handleSaveClick}
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
                <SettingsPRApplication prOptions={prOptions} commonInfo={commonInfo} />
                <Divider />
                <PRItemTable
                  items={purchaseItems}
                  handleAddNewItemClick={handleAddNewItemClick}
                  handleItemInputChange={handleItemInputChange}
                  total={total}
                  handleCalculateTotal={handleCalculateTotal}
                  category={category}
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
