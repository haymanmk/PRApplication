import { resolve } from "path";

export function UploadFile(formData) {
  const domain = "localhost";
  const port = 3001;
  const url_agent = `http://${domain}:${port}/agent/uploadFile`;

  return new Promise((resolve, reject) => {
    fetch(url_agent, {
      method: "POST",
      //   headers: { "content-type": "multipart/form-data" },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}
