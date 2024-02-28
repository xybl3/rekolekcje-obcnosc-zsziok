import { Client, Databases, Storage, ID } from "appwrite";

const client = new Client();

// client
//   .setEndpoint("https://cloud.appwrite.io/v1")
//   .setProject("65d798b721c99fdba8b9");

client
  .setEndpoint("http://34.32.26.18:8789/v1")
  .setProject("65df8be2425366d45e4b");

const storage = new Storage(client);
let dbId = "65df8c18771056640296";
let collectionId = "65d79bcb2aaaf3e857ac";
let bucketId = "65d8796f71f818093583";
let database = new Databases(client);

export interface UserPresenceRecord {
  name: string;
  surname: string;
  class: string;
  time: Date;
  isInChurch: boolean;
  latitude: number;
  longitude: number;
}
async function addPresenceRecord(rec: UserPresenceRecord) {
  return await database.createDocument(dbId, collectionId, ID.unique(), rec);
}
async function addImage(buffer: ArrayBuffer, name: string) {
  return await storage.createFile(
    bucketId,
    `${name}-${new Date().toISOString().slice(8, 10)}.jpg`,
    await base64toFile(buffer, name, "image/jpeg")
  );
}

export { client, addPresenceRecord, addImage, database };

async function base64toFile(
  base64Data: any,
  filename: string,
  mimeType: string
) {
  try {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64Data.replace(/^data:[^;]+;base64,/, "");

    // Convert base64 to array buffer
    const byteCharacters = atob(base64WithoutPrefix);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create a File object
    const file = new File([blob], filename, { type: mimeType });
    return file;
  } catch (error) {
    console.error("Error converting base64 to file:", error);
    throw error; // Rethrow the error for further handling
  }
}
