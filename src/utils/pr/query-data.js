import { useEffect } from "react";
import { useSelector } from "react-redux";

export function QueryData(options) {
  const cookies = useSelector((state) => state.cookies);
  const domain = "localhost";
  const port = 3001;
  const url_agent = `http://${domain}:${port}/agent`;

  useEffect;
}
