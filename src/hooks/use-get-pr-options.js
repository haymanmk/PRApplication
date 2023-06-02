import { useEffect, useState } from "react";
import { QueryData } from "src/utils/pr/query-data";

export const useGetPROptions = (cookies) => {
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
        empid: "",
        displayNameC: "",
      },
    ]
  );
  const [attachmentCategory, setAttachmentCategory] = useState(
    JSON.parse(localStorage.getItem("pr_attachment_category"))
  );

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

      //get attachment category
      if (!localStorage.getItem("pr_attachment_category")) {
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrGetAttachCateg.action?_dc=" + _dc;
        const body = {
          url: url,
          headers: {
            Cookie: cookies,
          },
          body: null,
        };

        QueryData(JSON.stringify(body)).then((res) => {
          const _data = res.rows;
          localStorage.setItem("pr_attachment_category", JSON.stringify(_data));
          setAttachmentCategory(_data);
        });
      }
    }
  }, [cookies]);

  return {
    category,
    costCenter,
    costCenterLocation,
    location,
    vendor,
    project,
    diyProject,
    userAccount,
    attachmentCategory,
    setCategory,
    setCostCenter,
    setCostCenterLocation,
    setLocation,
    setVendor,
    setProject,
    setDIYProject,
    setUserAccount,
    setAttachmentCategory,
  };
};
