let _cookies = {};
let setTimeout_ID;
const extensionID = "polabndodhphfbdfdabhbdhbhfohekfh";
let numEmptyCategories;

export default function GetCookies(message) {
  return new Promise((resolve, reject) => {
    message.map((cell) => {
      _cookies[cell.domain + cell.path] = null;
    });

    // console.log(_cookies);

    numEmptyCategories = Object.keys(_cookies).length;

    setTimeout_ID = setTimeout(() => console.log("GetCookies Extension no Response."), 5000);
    try {
      message.map((msg) => {
        // console.log(msg);
        chrome.runtime.sendMessage(extensionID, msg, (response, error) => {
          if (error) {
            console.error(error);
            return;
          }

          if (response.length) {
            response.map(filterCookies);
          }

          if (numEmptyCategories === 0) {
            clearTimeout(setTimeout_ID);
            // console.log(_cookies);
            resolve(_cookies);
          }
        });
      });

      // console.log("done");
    } catch (err) {
      console.error(err);

      clearTimeout(setTimeout_ID);
      reject(err);
    }
  });
}

function filterCookies(cookie) {
  const key = cookie.domain + cookie.path;

  if (_cookies[key] === null) {
    numEmptyCategories--;
    // console.log(numEmptyCategories);
    _cookies[key] = { [cookie.name]: cookie.value };
  } else if (_cookies[key] === undefined) return;
  else _cookies[key][cookie.name] = cookie.value;
}
