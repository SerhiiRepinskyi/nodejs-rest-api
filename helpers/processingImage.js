import Jimp from "jimp"; // бібліотека обробки зображень
import { HttpError } from "./index.js";

const processingImage = async (tempPath, newPath) => {
  try {
    const image = await Jimp.read(tempPath); // зчитування файлу із вказаного шляху
    // image.resize(250, 250); // зміна розміру зображення на 250x250 пікселів
    // image.contain(250, 250); // масштабувати зображення до вказаної ширини та висоти, деякі частини зображення можуть бути оточені чорними полами
    // image.cover(250, 250); // масштабувати зображення до вказаної ширини та висоти, деякі частини зображення можуть бути обрізані
    image.scaleToFit(250, 250); // масштабувати зображення до найбільшого розміру, який вміщується всередині вказаної ширини та висоти

    await image.writeAsync(newPath); // збереження після обробки файлу згідно вказаного шляху
  } catch (error) {
    console.error(error);
    throw HttpError(500, "Failed to process the image");
  }
};

export default processingImage;
