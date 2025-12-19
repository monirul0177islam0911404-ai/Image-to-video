"use client";
import { useState } from "react";

export default function Home() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setVideo(data.video);
    setLoading(false);
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Image → Video AI</h2>

      <form onSubmit={submit}>
        <input type="file" name="img1" required /><br />
        <input type="file" name="img2" required /><br />
        <textarea name="prompt" placeholder="Describe interaction..." required />
        <br />
        <button type="submit">
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </form>

      {video && (
        <video src={video} controls style={{ width: "100%", marginTop: 20 }} />
      )}
    </main>
  );
  }
