import { UserPresenceRecord, addPresenceRecord } from "@/lib/appwriteClient";

export async function POST(request: Request) {
  const data = (await request.json()) as unknown as UserPresenceRecord;
  console.log(data);

  if (
    !data.name ||
    !data.surname ||
    !data.latitude ||
    !data.longitude ||
    !data.class
  ) {
    return new Response("Missing required fields", { status: 400 });
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

  let userPresenceRecordToSave: UserPresenceRecord = {
    ...data,
    time: timeNow,
    isInChurch: isInChurch,
  };

  await addPresenceRecord(userPresenceRecordToSave);

  return new Response("OK", {
    status: 200,
  });
}
