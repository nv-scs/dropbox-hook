const fs = require("fs");
const express = require("express");
const app = express();

// console.log(script);

app.get("/", (req, res) => {
  console.log(req.query);

  return res.send(req.query.challenge ? req.query.challenge : "");
});

app.post("/webhook", (req, res) => {
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
});

const ACCESS_TOKEN =
  "sl.u.AFhf9TD6vboHUwEQ0nkRK9AkKnnaYXTQ8ju818XMnpFnuH5t8u4udCmRda0aguuuVZLow2GoEffh1eWhMnCNWMlJuczzdOSu8LM-lEt82mlNOFcMNd98cpU01UpsygOQvzUWZ3SYd1aiNUd2xMHNqrF7wvIiKRuRhPXfWI-1gtxwdefbwtU1APlUXtY2A4N_z3qEEV6U9dyyObYgzzn-4cCNILWk4uLOrN6g3ZtBfvzPAI0RGKuu2EW2HRy-Zo3H_ud3LhNhwJn8k6G3cD5jJJ1TUmqIiL4XWfxuR7rS9Cvuj8d60h94pHmBLtE2vR6B0Pxytl0PlCTilZZO85S_6D9wKIbFJ9wICIE2ouHs9vhe7oWWGC6qTz4nG36YsqbIl_eK4mXznuv2hXXBzLvTgiq6qpo8Kuc5GGNbv5PdrWoyGJPaHWLlki0hJwBFp90HsCXp6_my-ZRLETbKb7EE86obxjYQjSDE4EnE0NHVWJ1c5Fy0cTvubXSLwwkO56BDLGkUn_wUF0RuK91nyNOC51A5SC2nPbYMrZn9fA39FdtIvZVo1WID7yJo5uNV_xofTKMA_b7JgTHkloHyUyJcn-rSucH194TyCd3OCWns9D_K4QofBz_Pk42HGx6yD1SmbVrKov5Cr7nIlUfW6VfaNwLKitUA2YHBLuu9vw9NujVv5fgqNvzVTEHlnH_bYrluzKw6a8VkN9Nvs-dYmcSOShprV6HlkaY60o80fxoG6YVlNIiWDFsrKNDxXeuFsaqB35bUoXGVc-Mdlpdv6WidxpM7jyEBD3dtqb5KJGt8QdOt-RgqxmrrnqAJ3XWDO1XOtZruh8f_4yAaA1o8mwe0zzZyt8OgFfJzzH80Lv7Bly_AGa3wva932JtwUNc10aKesCdyde9WnOtLmCaVFk5gDpJ_YjawGVc7ptY_Iosm1bj-0g-shSdbFYU1o159J4Lq7Duc93aDWG4EOdXBa2m0NRyKRlu50WTi_dZnjINTioJVV9Nfjwzehh7UcGwW-z8sImFN1h1YaJXE8H8hISgcMHXAvHQJyHjXiR1thWM8Vd6bn0fslK9KNiDL16G3PSfEm_aalJPpH2welog_yEqVPS7XzwXj1OoqCz-7vJTYLAx8iq0DvgzkO_TsceaGufKjAPC77DDrB46Q7gHb4kYqOTIseTmWXRIw2dvJ1LtayuGt1HTPqj8lbRKk4cJwRZcLbG1w3HJ9PrNEr7P_KD0t-DmSWRSUbrfJv88FC_4Ink2WevALYqw9_f-Q_1MQ0soIK2T2pj0rBw631lmrKKGMyUfyYFadfP0y1NPKxVlOdXtUR7z5-T2MhDMc3kHmL5-qUbsKhh2YZyubIZ5j0-eE-66QgkSI01wYwHZ4shh9aWE1z9DdTPAYTylhLWcMNA3wl0NKn-sBPFAb_gUqeVJjDMoREDpjKwTqbMJLTPjpmcsb-USu-rSbn2bc7s_ODpSvTpBKyIhGlzlci_9GfthpxZaU2TTJzvA3cCJn4kOqhFGygg";
const downloadDir = "path/to/download/directory"; // Local directory to save downloaded files

// Create a simple HTTP server to receive webhook notifications from Dropbox
app.listen(3000, () => {
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
