import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET() {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Say hello" }
      ]
    })

    return Response.json(res.choices[0].message.content)
  } catch (error: any) {
    console.error("Test AI Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
