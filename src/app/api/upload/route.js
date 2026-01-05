import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function POST(request) {
  try {
    const { name1, name2 } = await request.json();

    if (!name1 || !name2) {
      return new Response(JSON.stringify({ error: "Names are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const percentage = Math.floor(Math.random() * 20) + 80;

    const msg = `User: *${name1}*\nPartner: *${name2}*\nPercentage: ${percentage}%`;

    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+923470924933",
      body: msg,
    });

    return new Response(JSON.stringify({ percentage, names: [name1, name2] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
