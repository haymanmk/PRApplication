import { useSelector } from "react-redux";
import { useGetCookies } from "./use-get-cookies";

const { useEffect, useState } = require("react");

export function useQueryPR(prNum = undefined) {
  const [prInfo, setPRInfo] = useState({});
  const cookies = useSelector((state) => state.cookies);
  const formData = new URLSearchParams();

  useGetCookies();

  if (prNum) {
    formData.append("segment1", prNum);
  } else {
    formData.append("mode", "0");
    formData.append("ouId", "86");
  }
  // console.log(formData.toString());

  const url = `https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrQueryApplyInitial.action?_dc=${Date.now()}`;
  const domain = "localhost";
  const port = 3001;
  const url_agent = `http://${domain}:${port}/agent`;

  useEffect(() => {
    if (cookies) {
      fetch(url_agent, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: url,
          headers: {
            Cookie: cookies,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: formData.toString(),
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log("prInfo: ", res?.rows[0]);
          setPRInfo(res?.rows[0]);
        })
        .catch((err) => console.error(err));
    }
  }, [cookies]);

  return { prInfo, setPRInfo };
}
