import Head from "next/head";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useQueryPR } from "src/hooks/use-query-pr";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState, useRef } from "react";
import { QueryData } from "src/utils/pr/query-data";
import { SettingsPRApplication } from "src/sections/purchase-request/settings-pr-application";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PlayCircleFilledRoundedIcon from "@mui/icons-material/PlayCircleFilledRounded";
import { initForm, prLineForm } from "src/utils/pr/save-all-init-form";

const Page = () => {
  const cookies = useSelector((state) => state.cookies);
  const [category, setCategory] = useState(JSON.parse(localStorage.getItem("pr_category")));
  const [costCenter, setCostCenter] = useState(JSON.parse(localStorage.getItem("pr_cost_center")));
  const [costCenterLocation, setCostCenterLocation] = useState(
    JSON.parse(localStorage.getItem("pr_cost_center_location"))
  );
  const [location, setLocation] = useState(JSON.parse(localStorage.getItem("pr_location")));
  const [vendor, setVendor] = useState([]);
  const [project, setProject] = useState(JSON.parse(localStorage.getItem("pr_project")));
  const [diyProject, setDIYProject] = useState(JSON.parse(localStorage.getItem("pr_diy_project")));
  const [userAccount, setUserAccount] = useState(
    JSON.parse(localStorage.getItem("pr_user_account")) || [
      {
        empid: "17521",
        displayNameC: "詹政翰(Hayman Chan)",
      },
    ]
  );
  const [prNo, setPRNo] = useState();
  const [applicantInfo, setApplicantInfo] = useState({
    empid: "",
    displayNameC: "",
  });
  const [applicationCostCenter, setApplicationCostCenter] = useState({ displayName: "" });
  const [applicationShipTo, setApplicationShipTo] = useState({ locationCode: "" });
  const [applicationVendor, setApplicationVendor] = useState();
  const [applicationProject, setApplicationProject] = useState({ projectName: "" });
  const [applicationDIYProject, setApplicationDIYProject] = useState({ displayValue: "" });
  const [requiredDate, setRequiredData] = useState();
  const [applicationReason, setApplicationReason] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");
  const [purchaseItems, setPurchaseItems] = useState({});
  const [total, setTotal] = useState({ subtotal: 0, tax: 0, total: 0 });

  const router = useRouter();
  const paramPRNo = router.query.paramPRNo?.[0];
  // console.log("paramPRNo: ", paramPRNo);

  let prInfo = useQueryPR(paramPRNo).rows[0];

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

  const handleCalculateTotal =
    (() => {
      console.log("calculate total: ", purchaseItems);
      if (Object.keys(purchaseItems).length) {
        console.log("calculate: ", purchaseItems);
        const subtotal = Object.values(purchaseItems).reduce(
          (prev, current) => prev + current.quantity * current.unitPtice,
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
        }
        setTotal({ subtotal, tax, total });
      }
    },
    [cookies, purchaseItems, applicationVendor]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      setPRNo(prInfo.prNo);
      localStorage.setItem("pr_applicant", prInfo.applicant);
      setApplicationReason(prInfo.reason);
      setApplicationDescription(prInfo.prComment);
    }
  }, [prInfo]);

  useEffect(() => {
    if (cookies) {
      const _dc = Date.now();

      // get category
      if (!localStorage.getItem("pr_category")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryCategoryWithFilter.action?_dc=" +
          _dc;
        const formData = new URLSearchParams();

        formData.append("sourceType", "PR");
        formData.append("ouId", "86");

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
            localStorage.setItem("pr_category", JSON.stringify(_data));
            setCategory(_data);
          })
          .catch((err) => console.error(err));
      }

      //get cost center
      if (!localStorage.getItem("pr_cost_center")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryCostCenter.action?_dc=" + _dc;
        const formData = new URLSearchParams();

        formData.append("requestText", "86");

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
            localStorage.setItem("pr_cost_center", JSON.stringify(_data));
            setCostCenter(_data);
          })
          .catch((err) => console.error(err));
      }

      //get cost center location/division
      if (!localStorage.getItem("pr_cost_center_location")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryDivision.action?_dc=" + _dc;
        const formData = new URLSearchParams();

        formData.append("requestText", "86");

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
            const _unique_data = _data.reduce((accumulator, current) => {
              const exists = accumulator.some((item) => item.orgCode === current.orgCode);

              if (!exists) accumulator.push(current);

              return accumulator;
            }, []);
            localStorage.setItem("pr_cost_center_location", JSON.stringify(_unique_data));
            setCostCenterLocation(_unique_data);
          })
          .catch((err) => console.error(err));
      }

      //get location
      if (!localStorage.getItem("pr_location")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/GetAllLocation.action?_dc=" + _dc;
        const formData = new URLSearchParams();

        formData.append("requestText", "86");

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
            localStorage.setItem("pr_location", JSON.stringify(_data));
            setLocation(_data);
          })
          .catch((err) => console.error(err));
      }

      //get financial project
      if (!localStorage.getItem("pr_project")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryProject.action?_dc=" + _dc;
        const formData = new URLSearchParams();

        formData.append("requestText", "86");
        formData.append("filterControl", "Y");

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
            localStorage.setItem("pr_project", JSON.stringify(_data));
            setProject(_data);
          })
          .catch((err) => console.error(err));
      }

      //get DIY project
      if (!localStorage.getItem("pr_diy_project")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryDiyProject.action?_dc=" + _dc;
        const formData = new URLSearchParams();

        formData.append("requestText", "false");
        formData.append("userInput", "");

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
            localStorage.setItem("pr_diy_project", JSON.stringify(_data));
            setDIYProject(_data);
          })
          .catch((err) => console.error(err));
      }

      //get employee accounts
      if (!localStorage.getItem("pr_user_account")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/QueryUserAccountsByUserInputRestrictLoction.action?_dc=" +
          _dc;
        const formData = new URLSearchParams();

        formData.append("empidOrName", "");

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
            const _data = res.rows.filter((employee) => employee.costCenter === "672");
            localStorage.setItem("pr_user_account", JSON.stringify(_data));
            setUserAccount(_data);
          })
          .catch((err) => console.error(err));
      }
    }
  }, [cookies]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      // const _applicantInfo = JSON.parse(localStorage.getItem("pr_user_account"))?.find(
      const _applicantInfo = userAccount?.find((element) => element.sid === prInfo.applicant);
      setApplicantInfo(_applicantInfo);
      // console.log(_applicantInfo);
    }
  }, [userAccount, prInfo]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      if (paramPRNo) {
        setApplicationCostCenter(
          JSON.parse(localStorage.getItem("pr_cost_center"))?.find(
            (element) => element.costCenterCode === prInfo.costCenter
          )
        );
      } else {
        setApplicationCostCenter(
          JSON.parse(localStorage.getItem("pr_cost_center"))?.find(
            (element) => element.costCenterCode === applicantInfo?.costCenter
          )
        );
      }
    }
  }, [costCenter, prInfo, applicantInfo]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      if (paramPRNo) {
        setApplicationShipTo(
          JSON.parse(localStorage.getItem("pr_location"))?.find(
            (element) => element.locationId === prInfo.shipTo
          )
        );
      } else {
        setApplicationShipTo(
          JSON.parse(localStorage.getItem("pr_location"))?.find(
            (element) => element.orgId === applicantInfo?.orgId
          )
        );
      }
    }
  }, [location, prInfo, applicantInfo]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      if (paramPRNo) {
        setApplicationProject(
          JSON.parse(localStorage.getItem("pr_project"))?.find(
            (element) => element.xxProjectId.toString() === prInfo.project
          )
        );
      }
    }
  }, [project, prInfo]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      if (paramPRNo) {
        setApplicationDIYProject(
          JSON.parse(localStorage.getItem("pr_diy_project"))?.find(
            (element) => element.projectNo === prInfo.eco
          )
        );
      }
    }
  }, [diyProject, prInfo]);

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
            <SettingsPRApplication
              prNo={prNo}
              applicantInfo={applicantInfo}
              userAccount={userAccount}
              applicationCostCenter={applicationCostCenter}
              costCenter={costCenter}
              costCenterLocation={costCenterLocation}
              applicationShipTo={applicationShipTo}
              location={location}
              applicationVendor={applicationVendor}
              vendor={vendor}
              handleApplicationVendorChange={handleApplicationVendorChange}
              handleVendorInputChange={handleVendorInputChange}
              applicationProject={applicationProject}
              project={project}
              applicationDIYProject={applicationDIYProject}
              diyProject={diyProject}
              requiredDate={requiredDate}
              handleRequiredDateChange={handleRequiredDateChange}
              applicationReason={applicationReason}
              applicationDescription={applicationDescription}
              purchaseItems={purchaseItems}
              handleAddNewItemClick={handleAddNewItemClick}
              handleItemInputChange={handleItemInputChange}
              total={total}
              handleCalculateTotal={handleCalculateTotal}
              category={category}
            />
            {/* <SettingsPassword /> */}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
