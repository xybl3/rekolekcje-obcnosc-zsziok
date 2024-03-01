import { db, query } from "./db";

async function main() {
  let hashes: string[] = [];
  for (let index = 0; index < 700; index++) {
    // generateSHA256(new Date().toISOString() + index).then((hash) => {
    //   const h = hash.slice(0, 12);
    //   console.log(index, h);
    //   hashes.push(h);
    // });

    const hashh = await generateSHA256(new Date().toISOString() + index);
    const h = hashh.slice(0, 12);
    hashes.push(h);
  }

  //set from hashes
  let set = new Set(hashes as unknown as string[]);
  console.log(set.size);

  set.forEach((value) => {
    query("INSERT INTO kody (code, used) VALUES (?, ?)", [value, false]);
  });
}

main();

async function generateSHA256(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");
  return hashHex;
}
