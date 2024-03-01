import { query } from "@/lib/db";

type UserPresenceRecord = {
  name: string;
  surname: string;
  class: string;
  latitude: number;
  longitude: number;
  code: string;
};

/**
 *
 * @param request
 * @returns 404 when code is invalid, 403 when code is already used, 400 when missing required fields, 200 when everything is OK
 */
export async function POST(request: Request) {
  const data = (await request.json()) as unknown as UserPresenceRecord;
  console.log(data);

  if (
    !data.name ||
    !data.surname ||
    !data.latitude ||
    !data.longitude ||
    !data.class ||
    !data.code
  ) {
    return new Response("Missing required fields", { status: 400 });
  }

  const res = await query("SELECT id, used FROM kody WHERE code = ?", [
    data.code,
  ]);
  if ((res as any).length === 0) {
    return new Response("Invalid code", { status: 404 });
  }
  const codeUsed = Boolean((res as any)[0].used);
  if (codeUsed) {
    return new Response("Code already used", { status: 403 });
  }

  let timeNow = new Date();

  // if (timeNow.getHours() < 8 || timeNow.getHours() >= 22) {
  //   return new Response("Outside of working hours", { status: 400 });
  // }

  // church is at 54,378496 lat, 18,5892864 long. Please make boolean that checks if user is in church, remember to include GPS accuracy in the check, so that it's not too strict

  const churchLatitude = 54.378496;
  const churchLongitude = 18.5892864;
  const accuracyError = 0.005; // 500m accuracy error

  let isInChurch =
    data.latitude > churchLatitude - accuracyError &&
    data.latitude < churchLatitude + accuracyError &&
    data.longitude > churchLongitude - accuracyError &&
    data.longitude < churchLongitude + accuracyError;

  // let userPresenceRecordToSave: UserPresenceRecord = {
  // ...data,
  // time: timeNow,
  // isInChurch: isInChurch,
  // };

  // await addPresenceRecord(userPresenceRecordToSave);

  await query(
    "INSERT INTO `obecnosc`(`name`, `surname`, `class`, `sent_at`, `in_church`, `latitude`, `longitude`, `used_code`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.name,
      data.surname,
      data.class,
      timeNow,
      isInChurch,
      data.latitude,
      data.longitude,
      (res as any)[0].id,
    ]
  );

  await query("UPDATE kody SET used = ? WHERE code = ?", [true, data.code]);

  return new Response("OK", {
    status: 200,
  });
}
