const express = require("express");
const app = express();

// console.log(script);

app.get("/", (req, res) => res.send(``));

app.post("/save", (req, res) => {
  res.json(res.data);
});

const ACCESS_TOKEN =
  "sl.u.AFjA5JtJg0o4MO1Pfr38h158q6JlDsMMfDC076c2P9aJddezk4Ch7CfDcKmKhRUtl00gCPgF8v6bIUTi8uTOf3ekK7kfiJcEoZgQHIJSyNqncHsmMWrjLP3Wb8D1MRVe05O5ZoS442DL6ghEBfE51JM0ErHmq74QwMkwI0zTeNMyRPHPHcticPfrQHrsZ4Nz9C7o-gpXb3ehQmDOjsT4n1LkSF1J00ecVPlEx9o_V5uxF8TAkRfBYgq1BDRNZnoL_1YyNed8FmG2w3KPksfLDqUe7o3n_9W2-DPxnaBCWK5aV7BL14pi9zmoqNDiS1kSdZaHtADo326tyfAUHi_492Zo3oLWZoHpZw5m-bYzA3WX0t4KaJL8ph_E7B9Y9ybbtumcVGiCkhCwHPUJ9Golw72Gm6LhH-OXoqNMrXugC7r_ASaCJDyCh2ZzB8OZERQHm9vBce15Fhr37jZDUNwSaA6l9NlJbqrKxRfox8UqIWIcVwejrrfmBr8pPLXl-uEqhkNtgAu_l0_bJBEg-Suoq2mZqUtknMow7-xXddjN5MD5-_UjttTNcJqU-8md7hPJk4ASpaDuAJJSuwYJe4Pr5oHWEZPL_a443U-V9ZiNr3NQ7wOa1_qzJRLk9OofzuT7GRl88zOK7m9i_pIe9cgAycQGE6OZOohLCdT7YUqIx9cMrlCRxxWCMlw6k9c6rX7Lkorpl3b9JnU-kCQn5pItakwKiGh9cZ2x_341bisz74BkPWc5nXbKP_gNEwgSjcZaVrISNIPyJyXTsSDn4lEACD46XGzGSeYMJyX7GxnS_PPPcTz7t500raf8l2yGDL7FWSiXMGS7wsj79qv9eoXA-VI5B4FXFb1dLZBW_GBg23KuPHs1xtGO4nR7Wc_PzGAz_SAO39Q_49ot2PUT1snjRFbJQocQWILW5Ml8mV4CgsKMru4Kw_Nv7ivUy9uD5hEUU_u4wlfpsBAkdPEHYF5cdXMiVgQ97teTJkcXGOlyaQKXIodrX78Q9TPSz2EIBqhftF5UBVFc6_JjdQWEhTMOv3Gyn_EGJeiHr90Fc_0l8eWRNtzOGFYr0Dl7fTkXH_GsCVghoYQLsLwIAIZKT1qWvuMPU1knOsPS3VmpcE-FwoZCAY4WsNr6N3MLLUj3zN3HCtWzvJZTxg8c5-9hZo0q7BIH5eKSw8WAdlgpTPHrXSC2ZwuEZm73xW_2bBwY7L4wlzu_MTxB2RjGLudPW7S-Fvt828XKq17cCibj2Vpx8_VSdQIV_pQFtfPZRsghun8X4kEJ68hjS2nOnalMOBloP12RHgHE7wMcHBzt4wj6dyQlcaw8Kr06EQqFvQhpl8IZnjFk8xKT_tqRd-stJqhgeAo94M4mJaYuu4-nUVqc3aDKx1ylA22mZPG37-qQUeSLMKGN0nz_Z56s3B_jhTvL1ktM0X5Tk-kLOln42AnLKhgLmOABXF025eqKvKVXA6-pXtzORZJJSxoMQ67mGZDvVQp2bRgrQlvDulUPnXq3CPcGRA";
const downloadDir = "path/to/download/directory"; // Local directory to save downloaded files

// Create a simple HTTP server to receive webhook notifications from Dropbox
http
  .createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/webhook") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const data = JSON.parse(body);
        const dropboxPath = data.path; // Path of the uploaded file in Dropbox

        // Asynchronously download the file to the local directory
        const localPath = `${downloadDir}/${data.name}`;
        await downloadFile(dropboxPath, localPath);

        res.writeHead(200);
        res.end("File download initiated.");
      });
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });

const downloadFile = async (dropboxPath, localPath) => {
  const response = await fetch(
    "https://content.dropboxapi.com/2/files/download",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Dropbox-API-Arg": JSON.stringify({ path: dropboxPath }),
      },
    }
  );

  if (response.ok) {
    const dest = fs.createWriteStream(localPath);
    response.body.pipe(dest);
    return new Promise((resolve, reject) => {
      dest.on("finish", resolve);
      dest.on("error", reject);
    });
  } else {
    throw new Error(
      `Failed to download file: ${response.status} - ${response.statusText}`
    );
  }
};

module.exports = app;
