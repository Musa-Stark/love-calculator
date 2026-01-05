import { promises as fs } from "fs";
import path from "path";
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

    const n1 = name1.trim().toLowerCase();
    const n2 = name2.trim().toLowerCase();

    // Create a consistent key by sorting names
    const names = [n1, n2].sort();
    const key = `${names[0]}|${names[1]}`;

    const dataPath = path.join(process.cwd(), "src", "data", "loves.json");

    let fileContent = "[]";
    try {
      fileContent = await fs.readFile(dataPath, "utf8");
    } catch (err) {
      // If file doesn't exist, we start with empty array
    }

    const loves = JSON.parse(fileContent);

    // Check if pair calculates already
    const existing = loves.find((item) => item.key === key);

    let percentage;

    if (existing) {
      percentage = existing.percentage;
    } else {
      // Generate random percentage > 90
      percentage = Math.floor(Math.random() * 20) + 80;

      const newEntry = {
        key,
        names: names, // Store originals or sorted? user wants "user will first look... if same names found... exchange okay"
        // key handles the exchange logic.
        percentage,
        createdAt: new Date().toISOString(),
      };

      loves.push(newEntry);

      await fs.writeFile(dataPath, JSON.stringify(loves, null, 2));
    }

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
