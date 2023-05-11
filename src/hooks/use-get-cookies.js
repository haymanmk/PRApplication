const { useEffect, useRef } = require("react");

export function useGetCookies() {
  let setTimeout_ID = useRef();
  useEffect(() => {
    const extensionID = "polabndodhphfbdfdabhbdhbhfohekfh";
    const message = {
      // openURL: "https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage",
      getCookies: "shiwpa-etrex9.garmin.com",
      getCookies: "linxpa-bpm-cluster.garmin.com",
      getCookies: ".garmin.com",
    };
    let cookies = "";

    try {
      setTimeout_ID.current = setTimeout(
        () => console.log("GetCookies Extension no Response."),
        5000
      );
      Object.keys(message).map((key) => {
        const msg = { [key]: message[key] };
        chrome.runtime.sendMessage(extensionID, msg, (res, err) => {
          if (err) console.error(err);
          else if (res.length) {
            console.log(res);
            res.map((cookie) => {
              cookies += `${cookie.name}=${cookie.value};`;
            });
          }
          if (cookies) getMyPR(cookies);
        });
      });
      clearTimeout(setTimeout_ID.current);
    } catch (err) {
      console.error(err);
      // console.log("GetCookies Extension not Found!");

      clearTimeout(setTimeout_ID.current);
      return;
    }
  }, []);
}

function getMyPR(cookies) {
  const _dc = Date.now();
  let url = `https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrQueryMyPrRecent.action?_dc=${_dc}`;
  let options = {
    method: "POST",
    headers: {
      Cookie: cookies,
    },
    mode: "no-cors",
  };
  fetch(url, options).then((response) => {
    console.log(response);
  });
}
