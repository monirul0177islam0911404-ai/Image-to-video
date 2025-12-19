import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.formData();
  const img1 = data.get("img1");
  const img2 = data.get("img2");
  const prompt = data.get("prompt");

  const toBase64 = async (file) =>
    `data:${file.type};base64,${Buffer.from(
      await file.arrayBuffer()
    ).toString("base64")}`;

  const image1 = await toBase64(img1);
  const image2 = await toBase64(img2);

  const start = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "8f9c7a42f",
      input: {
        image: image1,
        image2: image2,
        prompt,
        video_length: 15
      }
    })
  });

  const prediction = await start.json();

  let output = null;
  while (!output) {
    const poll = await fetch(prediction.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
      }
    });
    const result = await poll.json();
    if (result.status === "succeeded") output = result.output;
  }

  return NextResponse.json({ video: output });
        }
