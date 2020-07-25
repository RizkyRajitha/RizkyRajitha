const nasaApiKey = process.env.nasaApiKey || require("./config/env").nasaApiKey;

const axios = require("axios").default;

exports.readmeHnadler = (req, res) => {
  let imgurl = ""; //a image url for fallback in nasa api

  axios
    .get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`, {
      timeout: 3000,
    })
    .then((nasadata) => {
      console.log(nasadata.data);

      if (nasadata.data.media_type === "image") {
        imgurl = nasadata.data.url;
      }

      // let me know  if there is a better way 🙄
      axios
        .get(imgurl, {
          responseType: "arraybuffer",
        })
        .then((nasaimagderesponsedata) => {
          let imagebase64 = Buffer.from(
            nasaimagderesponsedata.data,
            "binary"
          ).toString("base64");

          console.log(imagebase64.slice(0, 20));

          let payload = `<svg  width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">    
        <image  width="1920" height="1080"  href="data:image/png;base64,${imagebase64}"/>
      </svg>`;
          res.setHeader("Content-Type", "image/svg+xml");
          res.send(payload);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
// fallback
      axios
        .get(imgurl, {
          responseType: "arraybuffer",
        })
        .then((nasaimagderesponsedata) => {
          let imagebase64 = Buffer.from(
            nasaimagderesponsedata.data,
            "binary"
          ).toString("base64");

          console.log(imagebase64.slice(0, 20));

          let payload = `<svg  width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">    
      <image  width="1920" height="1080"  href="data:image/png;base64,${imagebase64}"/>
    </svg>`;
          res.setHeader("Content-Type", "image/svg+xml");
          res.send(payload);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};
