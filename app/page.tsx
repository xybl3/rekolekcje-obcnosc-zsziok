"use client";
import Image from "next/image";
import logo from "@/logo.png";
import { Input } from "@/components/ui/input";
import ClassSelection from "@/components/ClassSelection";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getGeolocation } from "@/lib/geolocationUtils";
import axios, { AxiosError } from "axios";
export default function Home() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState({
    name: "",
    schoolClass: "",
    code: "",
  });

  type PresenceStatusSent = "not-sent" | "loading" | "sent" | "error";

  const [presenceStatus, setPresenceStatus] =
    useState<PresenceStatusSent>("not-sent");

  const sendPresence = async () => {
    try {
      setPresenceStatus("loading");
      await axios.post("/api/presence", {
        name: params.name.split(" ")[0],
        surname: params.name.split(" ")[1],
        class: params.schoolClass,
        latitude: userLocation?.coords.latitude,
        longitude: userLocation?.coords.longitude,
        code: params.code,
      });
      setPresenceStatus("sent");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        switch (err.response?.status) {
          case 404:
            setError("Wpisany kod jest nieprawidłowy");
            alert("Wpisany kod jest nieprawidłowy");
            break;
          case 400:
            setError("Wpisane dane są nieprawidłowe");
            alert("Wpisane dane są nieprawidłowe");
            break;
          case 403:
            setError("Wpisany kod został już użyty");
            alert("Wpisany kod został już użyty");
            break;
          default:
            setError("Wystąpił błąd " + err.response?.status);
            alert("Wystąpił błąd " + err.response?.status);
        }

        setPresenceStatus("error");
      }
    }
  };

  useEffect(() => {
    try {
      getGeolocation({
        onUpdate: (pos) => {
          console.log(pos);
          setUserLocation(pos);
        },
      });
    } catch (err) {
      if (userLocation === null) {
        setError("Wystąpił błąd");
      }
    }
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-dvh min-w-max">
      <div className="w-full md:w-3/5 lg:w-2/5 bg-gray-100 dark:bg-gray-900 p-5 rounded-lg">
        <div className="flex flex-col items-center">
          <Image src={logo} alt="Logo ZSZiOK" />
          <h1 className="text-4xl font-bold">Rekolekcje ZSZiOK 2025</h1>
          <h2 className="text-2xl text-gray-400">
            Weryfikator obecności na rekolekcjach 2025
          </h2>
        </div>
        {userLocation === null && (
          <Alert>
            <AlertTriangle />
            <AlertTitle>Uwaga</AlertTitle>
            <AlertDescription>
              Lokalizacja użytkownika jest pobierana. Proszę zezwolić na
              lokalizację
            </AlertDescription>
          </Alert>
        )}
        {error !== null && (
          <Alert variant={"destructive"}>
            <AlertTriangle />
            <AlertTitle>Błąd</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-4 mt-4">
          {presenceStatus === "sent" ? (
            <Alert variant={"default"}>
              <Check />
              <AlertTitle>Sukces</AlertTitle>
              <AlertDescription>
                <p>Obecność została potwierdzona</p>
                <p>Dziękujemy za udział w rekolekcjach!</p>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Input
                placeholder="Imię i nazwisko"
                onChange={(v) => {
                  setParams({ ...params, name: v.target.value });
                }}
              />
              <ClassSelection
                onSelect={(v) => {
                  setParams({ ...params, schoolClass: v });
                }}
              />
              <Input
                placeholder="Unikalny kod"
                onChange={(v) => {
                  setParams({ ...params, code: v.target.value });
                }}
              />
            </>
          )}
          <Button
            disabled={
              userLocation === null ||
              presenceStatus === "loading" ||
              params.name === "" ||
              params.schoolClass === "" ||
              params.code === "" ||
              params.name.split(" ").length < 2 ||
              params.name.split(" ")[0] === "" ||
              params.name.split(" ")[1] === "" ||
              presenceStatus === "sent"
            }
            onClick={() => {
              sendPresence();
            }}
          >
            {presenceStatus === "loading"
              ? "Wysyłanie..."
              : presenceStatus === "sent"
              ? "Wysłano!"
              : presenceStatus === "error"
              ? "Spróbuj ponownie"
              : "Potwierdź obecność"}
          </Button>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-3">
        Jeśli masz problem z potwierdzeniem obecności, udaj się do zakrystii.{" "}
      </p>
      <p className="text-gray-600 text-sm">
        Weryfikator stworzony na potrzeby ZSZiO do weryfikacji obecności
      </p>
    </main>
  );
}
