
export const chatbot = async (req, res) => {
  try {
    const { query } = await req.body;

    const prompt = `You are a helpful job search assistant. Answer the user's question clearly, concisely, and professionally:\n${query}`;


    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content  ?? "Sorry, I couldn't process that right now."
    res.status(200).json({
      success: true,
      message: reply
    })

  } catch (error) {
    console.log("ChatBot Error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
