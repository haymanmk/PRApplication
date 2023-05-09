const { useEffect } = require("react");

export function useCORS() {
  useEffect(() => {
    // window.open("https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrInit.action", "_blank");

    fetch("https://shiwpa-etrex9.garmin.com:9099/FINSystem/PrApplyInit.action", {
      method: "GET",
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
}
