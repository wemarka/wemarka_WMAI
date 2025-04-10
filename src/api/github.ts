// src/api/github.ts
export default async function handler(req, res) {
  const { filePath } = req.body;

  const response = await fetch(
    `https://api.github.com/repos/wemarka/wemarka_WMAI/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  const data = await response.json();
  if (data.content) {
    const content = Buffer.from(data.content, "base64").toString("utf8");
    return res.status(200).json({ content });
  } else {
    return res.status(500).json({ error: "Could not fetch file." });
  }
}
