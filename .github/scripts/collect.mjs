import fs from "fs";

const API_URL = process.env.GIVERGY_API_URL;

async function run() {
  if (!API_URL) {
    throw new Error("Missing GIVERGY_API_URL environment variable.");
  }
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();
  const calculated = data.entity[0].totalRaisedAmount;
  const timestamp = new Date().toISOString();
  const row = `${timestamp},${calculated}\n`;

  const path = "data/metrics.csv";

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "timestamp,value\n");
  }

  fs.appendFileSync(path, row);

  console.log(`Recorded ${calculated} at ${timestamp}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
