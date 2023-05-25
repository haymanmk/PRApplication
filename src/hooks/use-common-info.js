import { useState, useEffect } from "react";

export const useCommonInfo = ({ userAccount, costCenter, location, project, diyProject }) => {
  let prInfo = useQueryPR(paramPRNo).rows[0];
  const [prNo, setPRNo] = useState();
  const [applicantInfo, setApplicantInfo] = useState({
    empid: "",
    displayNameC: "",
  });
  const [applicationCostCenter, setApplicationCostCenter] = useState({ displayName: "" });
  const [applicationShipTo, setApplicationShipTo] = useState({ locationCode: "" });
  const [applicationVendor, setApplicationVendor] = useState({});
  const [applicationProject, setApplicationProject] = useState({ projectName: "" });
  const [applicationDIYProject, setApplicationDIYProject] = useState({ displayValue: "" });
  const [applicationReason, setApplicationReason] = useState("");
  const [applicationDescription, setApplicationDescription] = useState("");
  const [requiredDate, setRequiredData] = useState();

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

  return {
    prNo,
    applicationCostCenter,
    applicationShipTo,
    applicationVendor,
    applicationProject,
    applicationDIYProject,
    applicationReason,
    applicationDescription,
    requiredDate,
    setPRNo,
    setApplicantInfo,
    setApplicationCostCenter,
    setApplicationShipTo,
    setApplicationVendor,
    setApplicationProject,
    setApplicationDIYProject,
    setApplicationReason,
    setApplicationDescription,
    setRequiredData,
  };
};
