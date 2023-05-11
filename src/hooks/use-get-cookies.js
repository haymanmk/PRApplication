const { useEffect, useRef } = require("react");

export function useGetCookies() {
  let setTimeout_ID = useRef();
  useEffect(() => {
    const extensionID = "glcaenamkkmjnpmaedecbgimgdeaocck";
    const message = {
      openURL: "https://developer.chrome.com/docs/extensions/reference/runtime/#method-sendMessage",
      getCookies: "leetcode.com",
    };

    try {
      Object.keys(message).map((key) => {
        setTimeout_ID.current = setTimeout(
          () => console.log("GetCookies Extension no Response."),
          5000
        );

        const msg = { [key]: message[key] };
        chrome.runtime.sendMessage(extensionID, msg, (res, err) => {
          if (err) console.error(err);
          else if (res) {
            console.log(res);
          }
          clearTimeout(setTimeout_ID.current);
        });
      });
    } catch (err) {
      console.error(err);
      // console.log("GetCookies Extension not Found!");
      return;
    }
  }, []);
}
