import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { storeAction } from "src/redux/state-slice";
import GetCookies from "src/utils/pr/get-cookies";

export function useGetCookies() {
  const message = [
    { cmd: "getCookies", domain: "shiwpa-etrex9.garmin.com", path: "/" },
    { cmd: "getCookies", domain: "shiwpa-etrex9.garmin.com", path: "/FINSystem" },
    { cmd: "getCookies", domain: "linxpa-bpm-cluster.garmin.com", path: "/user-voice" },
    { cmd: "getCookies", domain: ".garmin.com", path: "/" },
  ];

  const { updateCookies } = storeAction;
  const dispatch = useDispatch();

  useEffect(() => {
    GetCookies(message)
      .then((cookies) => {
        const strCookies = toCookieStr(cookies);
        dispatch(updateCookies(strCookies));
      })
      .catch((err) => console.error(err));
    return () => {
      console.log("cleanup");
    };
  }, []);
}

function toCookieStr(cookies) {
  let Cookie = "";
  Object.values(cookies).map((cell) => {
    Object.keys(cell).map((name) => {
      Cookie += `${name}=${cell[name]};`;
    });
  });

  return Cookie;
}
