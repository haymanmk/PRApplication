import { useCallback, useRef } from "react";
import { QueryData } from "src/utils/pr/query-data";
import { initForm, prLineForm } from "src/utils/pr/save-all-init-form";
import { UploadFile } from "src/utils/pr/upload-file";

export const useHandleChangePR = ({ cookies, prInfo, prOptions }) => {
  const setTimeoutID_vendorInput = useRef();
  const _id = useRef(0);

  const handleSaveClick = useCallback(
    (event) => {
      const url = "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrSaveAll.action";
      const formData = new URLSearchParams();

      const _prLinesAll = [];
      let _lineNum = 1;
      if (prInfo.purchaseItems.length) {
        prInfo.purchaseItems.map((value) => {
          // console.log(value);
          _prLinesAll.push({
            ...prLineForm,
            prLineId: value.prLineId,
            lineNum: _lineNum++,
            division: prInfo.applicationCostCenterLocation.division,
            divisionCode: prInfo.applicationCostCenterLocation.orgCode,
            costCenter: prInfo.applicationCostCenter.costCenterCode,
            costCenter: prInfo.applicationCostCenter.displayName,
            categoryId: value.category.categoryId,
            prCategoryId: value.category.categoryMasterId,
            category: value.category.displayName,
            matchOption: prInfo.applicationVendor.matchoption,
            specification: value.spec,
            description: value.description,
            quantity: value.quantity,
            unitPrice: value.unitPrice,
            amount: value.sum,
            taxCodeId: prInfo.applicationVendor.taxCodeId,
            needByDate: prInfo.requiredDate,
          });
        });
      }

      let saveData = {
        ...initForm.saveData,
        prHeaderId: prInfo.prInfo.prHeaderId,
        prNo: prInfo.prNo,
        applicant: prInfo.applicantInfo.sid,
        creator: prInfo.prInfo.creator,
        creationDate: prInfo.prInfo.creationDate,
        shipTo: prInfo.applicationShipTo.locationId,
        costCenter: prInfo.applicationCostCenter.costCenterCode,
        vendorId: prInfo.applicationVendor.vendorId,
        matchOption: prInfo.applicationVendor.matchoption,
        taxCodeId: prInfo.applicationVendor.taxCodeId,
        roundingRule: prInfo.applicationVendor.roundingRule,
        gcHs: prInfo.applicationVendor.gcHs,
        vendor: prInfo.applicationVendor.vendorSiteId,
        termsId: prInfo.applicationVendor.termsId,
        currency: prInfo.applicationVendor.currency,
        total: prInfo.total.total,
        subTotal: prInfo.total.subtotal,
        tax: prInfo.total.tax,
        designEmpName: prInfo.prInfo.creator,
        project: prInfo.applicationProject.xxProjectId,
        reason: prInfo.applicationReason,
        prComment: prInfo.applicationDescription,
        prLinesAll: [..._prLinesAll],
      };

      if (prInfo.applicationDIYProject.projectNo) {
        saveData.eco = prInfo.applicationDIYProject.projectNo;
        saveData.diyProject = prInfo.applicationDIYProject.projectNo;
      }

      formData.append("requestText", JSON.stringify({ saveData }));

      console.log("initForm", saveData);

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
          const _data = res.rows[0];
          // console.log("Response of Save: ", _data);
          prInfo.setAppliedData((prev) => ({ ...prev, ..._data }));
          prInfo.setPRInfo((prev) => ({
            ...prev,
            ..._data,
          }));
          let _purchaseItems = Object.assign([], prInfo.purchaseItems);
          _data.prLine.map((value, index) => {
            _purchaseItems[index].prLineId = value.prLineId;
            // console.log("prLineId: ", value.prLineId);
          });
          prInfo.setPurchaseItems(_purchaseItems);
          _id.current = 0;
          // handleUploadFile(cookies, prInfo.prInfo.prHeaderId);
        })
        .catch((err) => console.error(err));
    },
    [cookies, prInfo]
  );

  const handleSubmitClick = useCallback(
    (event) => {
      if (!cookies) return;
      const url = "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrSubmit.action";
      const formData = new URLSearchParams();

      if (Object.values(prInfo.appliedData).length) {
        formData.append("id", prInfo.appliedData.prHeaderId);
        formData.append("view", "false");

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
            console.log("Response of Submit: ", _data);
          })
          .catch((err) => console.error(err));
      }
    },
    [cookies, prInfo]
  );

  const handleApplicantChange = useCallback(
    (event, value) => {
      // console.log("new applicant: ", value);
      prInfo.setApplicantInfo(value);
    },
    [prInfo]
  );

  const handleApplicationCostCenterChange = useCallback(
    (event, value) => {
      prInfo.setApplicationCostCenter(value);
    },
    [prInfo]
  );

  const handleApplicationCostCenterLocationChange = useCallback(
    (event, value) => {
      prInfo.setApplicationCostCenterLocation(value);
    },
    [prInfo]
  );

  const handleApplicationShipToChange = useCallback(
    (event, value) => {
      prInfo.setApplicationShipTo(value);
    },
    [prInfo]
  );

  const handleApplicationDIYProjectChange = useCallback(
    (event, value) => {
      prInfo.setApplicationDIYProject(value);
    },
    [prInfo]
  );

  const handleRequiredDateChange = useCallback(
    (date) => {
      // console.log(date);
      prInfo.setRequiredDate(date.toISOString());
    },
    [prInfo]
  );

  const handleApplicationVendorChange = useCallback(
    (event, value) => {
      prInfo.setApplicationVendor(value);
    },
    [prInfo]
  );

  const handleVendorInputChange = useCallback(
    (event, value) => {
      if (!value || !cookies) return;
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
            prOptions.setVendor(_data);
          })
          .catch((err) => console.error(err));
      }, 1000);
    },
    [cookies]
  );

  const handleApplicationProjectChange = useCallback(
    (event, value) => {
      prInfo.setApplicationProject(value);
    },
    [prInfo]
  );

  const handleReasonChange = useCallback(
    (event) => {
      prInfo.setApplicationReason(event.target.value);
    },
    [prInfo]
  );

  const handleDescriptionChange = useCallback(
    (event) => {
      prInfo.setApplicationDescription(event.target.value);
    },
    [prInfo]
  );

  const handleAddNewItemClick = useCallback(
    (event) => {
      prInfo.setPurchaseItems((prev) => [
        ...prev,
        {
          prLineId: _id.current,
          category: prOptions.category.find(
            (element) => element.displayName === "09-01. Consumption Materials"
          ),
          spec: "",
          description: "",
          quantity: 0,
          unitPrice: 0,
          sum: 0,
        },
      ]);
      _id.current++;
    },
    [_id.current, prOptions.category, prInfo]
  );

  const handleItemInputChange = useCallback(
    (rowID, key, newValue) => {
      // console.log("rowID: ", rowID, key, newValue);
      let _purchaseItems = Object.assign([], prInfo.purchaseItems);
      let _item = _purchaseItems.find((element) => element.prLineId === rowID);
      _item[key] = newValue;
      prInfo.setPurchaseItems(_purchaseItems);
    },
    [prInfo]
  );

  const handleCalculateTotal = useCallback(() => {
    if (Object.keys(prInfo.purchaseItems).length) {
      const subtotal = Object.values(prInfo.purchaseItems).reduce(
        (prev, current) => prev + Number(current.quantity) * Number(current.unitPrice),
        0
      );
      const taxRate = 0.05;
      let tax = 0;
      let _total = 0;

      if (Object.values(prInfo.applicationVendor).length) {
        const _dc = Math.random().toString().substring(2, 10);
        const url =
          "https://shiwpa-etrex9.garmin.com:9099/FINSystem/GetSubtotalToTotalAndTax.action?_dc=" +
          _dc;

        const formData = new URLSearchParams();
        formData.append("amount", subtotal.toString());
        formData.append("currencyCode", prInfo.applicationVendor.currency);
        formData.append("taxCodeId", prInfo.applicationVendor.taxCodeId);
        formData.append("roundingRule", prInfo.applicationVendor.roundingRule);

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
            const _data = res.rows[0];
            tax = Number(_data.tax).toFixed(2);
            _total = Number(_data.price).toFixed(2);
            // console.log({ subtotal, tax, _total });
            prInfo.setTotal((prev) => ({ ...prev, ...{ subtotal, tax, total: _total } }));
          })
          .catch((err) => console.error(err));
      } else {
        tax = (subtotal * taxRate).toFixed(2);
        _total = subtotal * (1 + taxRate).toFixed(2);
        // console.log({ subtotal, tax, _total });
        prInfo.setTotal((prev) => ({ ...prev, ...{ subtotal, tax, total: _total } }));
      }
    }
  }, [cookies, prInfo.purchaseItems, prInfo.applicationVendor]);

  const handleCostCenterChange = useCallback(
    (event, value) => {
      // console.log("new cost center: ", value);
      prOptions.setCostCenter(value);
    },
    [prOptions]
  );

  const handleFileInputChange = useCallback(
    (event) => {
      console.log(event.target.files);
      prInfo.setAttachments((prev) => [
        ...prev,
        ...Object.values(event.target.files).map((file) => ({
          attachment: file,
        })),
      ]);
    },
    [prInfo]
  );

  const handleAttachmentCategoryChange = useCallback(
    (index, value) => {
      const _attachments = Object.assign([], prInfo.attachments);
      _attachments[index]["category"] = value;
      prInfo.setAttachments(_attachments);
    },
    [prInfo]
  );
  const handleUploadFile = useCallback(
    (files) => {
      const prHeaderId = prInfo.prInfo?.prHeaderId;

      if (cookies && prHeaderId) {
        const url = "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrFileUpload.action";

        const formData = new FormData();
        formData.set("cookies", cookies);
        formData.set("prHeaderId", prHeaderId);
        formData.set("rev", 0);

        files.map((file, index) => {
          console.log("Uploading file: ", file);
          const requestText = {
            prHeaderId: prHeaderId,
            rev: 0,
            categoryId: file.category.filetypecode,
            supplierEnable: 0,
            comments: file.comments || "",
          };

          formData.set("requestText", JSON.stringify(requestText));
          formData.set("categoryId", file.category.filetypecode);
          formData.set("supplierEnable", 0);
          formData.set("comments", file.comments || "");
          formData.set("attachment", file.attachment);

          UploadFile(formData)
            .then((res) => {
              console.log(res);
              if (res.success) {
                const _data = res.message.rows[0];
                file["fileUrl"] = _data.fileUrl;
                prInfo.setAttachments((prev) => [...prev, file]);
              }
            })
            .catch((err) => console.error);
        });
      } else {
        if (!cookies) console.error("Cookies shall not be empty.");
        if (!prHeaderId) console.error("prHeaderId shall not be empty.");
      }
    },
    [cookies, prInfo]
  );

  return {
    handleSaveClick,
    handleSubmitClick,
    handleApplicantChange,
    handleApplicationCostCenterChange,
    handleApplicationCostCenterLocationChange,
    handleApplicationShipToChange,
    handleVendorInputChange,
    handleApplicationVendorChange,
    handleApplicationProjectChange,
    handleApplicationDIYProjectChange,
    handleRequiredDateChange,
    handleReasonChange,
    handleDescriptionChange,
    handleAddNewItemClick,
    handleItemInputChange,
    handleCalculateTotal,
    handleCostCenterChange,
    handleFileInputChange,
    handleAttachmentCategoryChange,
    handleUploadFile,
  };
};
