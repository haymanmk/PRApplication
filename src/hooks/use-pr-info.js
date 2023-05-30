import { useState, useEffect } from "react";
import { useQueryPR } from "./use-query-pr";

export const usePRInfo = ({
  paramPRNo,
  userAccount,
  costCenter,
  costCenterLocation,
  location,
  project,
  diyProject,
}) => {
  const { prInfo, setPRInfo } = useQueryPR(paramPRNo);
  const [prNo, setPRNo] = useState();
  const [applicantInfo, setApplicantInfo] = useState({
    empid: "",
    displayNameC: "",
  });
  const [applicationCostCenter, setApplicationCostCenter] = useState({ displayName: "" });
  const [applicationCostCenterLocation, setApplicationCostCenterLocation] = useState({});
  const [applicationShipTo, setApplicationShipTo] = useState({ locationCode: "" });
  const [applicationVendor, setApplicationVendor] = useState({});
  const [applicationProject, setApplicationProject] = useState({ projectName: "" });
  const [applicationDIYProject, setApplicationDIYProject] = useState({ displayValue: "" });
  const [applicationReason, setApplicationReason] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString());
  const [total, setTotal] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [appliedData, setAppliedData] = useState();
  const [purchaseItems, setPurchaseItems] = useState([]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      setPRNo(prInfo.prNo);
      localStorage.setItem("pr_applicant", prInfo.applicant);
      setApplicationReason(prInfo.reason);
      setApplicationDescription(prInfo.prComment);
    }
  }, [prInfo]);

  useEffect(() => {
    if (Object.keys(prInfo).length) {
      const _applicantInfo = userAccount?.find((element) => element.sid === prInfo.applicant);
      setApplicantInfo(_applicantInfo);
      // console.log("_applicantInfo: ", _applicantInfo);
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
    if (Object?.keys(prInfo).length) {
      if (paramPRNo) {
        setApplicationCostCenterLocation(
          costCenterLocation?.find((element) => element.orgCode === prInfo.prLine[0]?.divisionCode)
        );
      } else {
        // console.log("costCenterLocation: ", costCenterLocation);
        setApplicationCostCenterLocation(
          costCenterLocation?.find((element) => element.orgCode === "不分廠")
        );
      }
    }
  }, [costCenterLocation, prInfo]);
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

  return {
    prInfo,
    prNo,
    applicantInfo,
    applicationCostCenter,
    applicationCostCenterLocation,
    applicationShipTo,
    applicationVendor,
    applicationProject,
    applicationDIYProject,
    applicationReason,
    applicationDescription,
    requiredDate,
    total,
    appliedData,
    purchaseItems,
    setPRInfo,
    setPRNo,
    setApplicantInfo,
    setApplicationCostCenter,
    setApplicationCostCenterLocation,
    setApplicationShipTo,
    setApplicationVendor,
    setApplicationProject,
    setApplicationDIYProject,
    setApplicationReason,
    setApplicationDescription,
    setRequiredDate,
    setTotal,
    setAppliedData,
    setPurchaseItems,
  };
};
