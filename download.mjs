import https from "https";
import fs from "fs";

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function main() {
  await download("https://modelviewer.dev/shared-assets/models/Avocado.glb", "./public/models/food.glb");
  console.log("Downloaded food.glb");
  await download("https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/targets.mind", "./public/targets/menu-marker.mind");
  console.log("Downloaded menu-marker.mind");
}

main();
