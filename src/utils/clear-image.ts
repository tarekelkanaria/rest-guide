import fs from "fs";
import path from "path";

export const clearImage = (imageName: string) => {
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    imageName
  );
  fs.unlink(filePath, (err) => console.log(err));
};
