import { use, useCallback, useRef } from "react";
import { QueryData } from "src/utils/pr/query-data";

export const useHandleChangePR = ({ cookies, prInfo, prOptions }) => {
  const setTimeoutID_vendorInput = useRef();
  const _id = useRef(Math.random().toString().substring(2, 8));

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
          prInfo.setAppliedData((prev) => ({ ...prev, ..._data }));
        })
        .catch((err) => console.error(err));
    },
    [cookies]
  );

  const handleRequiredDateChange = useCallback((date) => {
    // console.log(date);
    prInfo.setRequiredDate(date);
  }, []);

  const handleApplicationVendorChange = useCallback((event, value) => {
    prInfo.setApplicationVendor(value);
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
            prOptions.setVendor(_data);
          })
          .catch((err) => console.error(err));
      }, 1000);
    },
    [cookies]
  );

  const handleReasonChange = useCallback((event) => {
    prInfo.setApplicationReason(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event) => {
    prInfo.setApplicationDescription(event.target.value);
  }, []);

  const handleAddNewItemClick = useCallback(
    (event) => {
      prInfo.setPurchaseItems((prev) => ({
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
    },
    [_id.current]
  );

  const handleItemInputChange = useCallback((rowID, newValue) => {
    prInfo.setPurchaseItems((prev) => ({
      ...prev,
      [rowID]: { ...prev[rowID], ...newValue },
    }));
  }, []);

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
            _total = _data.price;
          })
          .catch((err) => console.error(err));
      } else {
        tax = (subtotal * taxRate).toFixed(2);
        _total = subtotal * (1 + taxRate).toFixed(2);
        // console.log({ subtotal, tax, _total });
      }
      prInfo.setTotal((prev) => ({ ...prev, ...{ subtotal, tax, total: _total } }));
    }
  }, [cookies, prInfo.purchaseItems, prInfo.applicationVendor]);

  const handleApplicantChange = useCallback((event, value) => {
    // console.log("new applicant: ", value);
    prInfo.setApplicantInfo(value);
  }, []);

  const handleCostCenterChange = useCallback((event, value) => {
    // console.log("new cost center: ", value);
    prOptions.setCostCenter(value);
  }, []);

  return {
    handleSaveClick,
    handleRequiredDateChange,
    handleApplicationVendorChange,
    handleVendorInputChange,
    handleReasonChange,
    handleDescriptionChange,
    handleAddNewItemClick,
    handleItemInputChange,
    handleCalculateTotal,
    handleApplicantChange,
    handleCostCenterChange,
  };
};
