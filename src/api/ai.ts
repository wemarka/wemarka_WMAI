// src/api/ai.ts
export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3, // Lower temperature for more consistent, focused responses
        max_tokens: 2000, // Ensure we get a complete response
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || "Error calling OpenAI API",
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in AI handler:", error);
    return res.status(500).json({
      error: error.message || "Internal server error in AI handler",
    });
  }
}
