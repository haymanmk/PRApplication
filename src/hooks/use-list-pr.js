import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeAction } from "src/redux/state-slice";

export default function useGetPRList() {
  const cookies = useSelector((state) => state.cookies);
  const dispatch = useDispatch();
  const { updatePRInfo } = storeAction;

  const url =
    "https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrQueryMyPrRecent.action?_dc=" + Date.now();
  const domain = "localhost";
  const port = 3001;
  const url_agent = `http://${domain}:${port}/agent`;

  useEffect(() => {
    if (cookies) {
      fetch(url_agent, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          headers: {
            Cookie: cookies,
          },
          body: {},
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          dispatch(updatePRInfo({ pr_list: res.rows }));
        })
        .catch((err) => console.error(err));
    }
  }, [cookies]);
}
