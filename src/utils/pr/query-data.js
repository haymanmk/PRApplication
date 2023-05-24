import { useEffect } from "react";
import { useSelector } from "react-redux";

export function QueryData(body) {
  const domain = "localhost";
  const port = 3001;
  const url_agent = `http://${domain}:${port}/agent`;

  return new Promise((resolve, reject) => {
    fetch(url_agent, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body,
    })
      .then((res) => res.json())
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
