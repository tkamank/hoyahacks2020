import axios from "axios";

export const GCV = {
  annotateImage: async (image: string) => {
    return await axios({
      url: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.API_KEY}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        requests: [
          {
            image: {
              content: image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      },
    });
  },
};
