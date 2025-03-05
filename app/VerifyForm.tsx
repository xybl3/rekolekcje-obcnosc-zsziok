"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ClassSelection from "@/components/ClassSelection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocateIcon, RocketIcon, Check, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

export default function VerifyForm() {
  const [loading, setLoading] = useState(true);
  const [alreadySent, setAlreadySent] = useState(false);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  const [uniqueCode, setUniqueCode] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [dataSentLoadingStatus, setDataSentLoadingStatus] = useState<
    "not-sent" | "loading" | "sent" | "error"
  >("not-sent");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setSelectedClass(localStorage.getItem("class") || "");
    setAlreadySent(
      localStorage.getItem("lastSaved") === new Date().toLocaleDateString()
    );
    setLoading(false);
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Twoja przeglądarka nie obsługuje lokalizacji. Podejdź do zakrystii, aby zweryfikować obecność."
      );
      return;
    }
    navigator.geolocation.watchPosition(
      setUserLocation,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Dostęp do lokalizacji jest wymagany do zweryfikowania obecności. Użyj innej przeglądarki lub zgłoś się do zakrystii."
          );
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setDataSentLoadingStatus("loading");
    localStorage.setItem("name", name);
    try {
      await axios.post("/api/presence", {
        name: name.split(" ")[0],
        surname: name.split(" ")[1] || "",
        class: selectedClass,
        latitude: userLocation?.coords.latitude || 0,
        longitude: userLocation?.coords.longitude || 0,
        code: uniqueCode,
      });
      setDataSentLoadingStatus("sent");
      localStorage.setItem("lastSaved", new Date().toLocaleDateString());
    } catch (e) {
      const errorResponse = e as AxiosError;
      setErrorMessage(
        errorResponse.response?.status === 404
          ? "Nieprawidłowy kod"
          : errorResponse.response?.status === 403
          ? "Kod został już użyty"
          : errorResponse.response?.status === 400
          ? "Pola nie zostały uzupełnione"
          : errorResponse.response?.status === 500
          ? "Błąd serwera"
          : "Wystąpił nieznany błąd"
      );
      setDataSentLoadingStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Ładowanie, proszę czekać</p>
      </div>
    );
  }

  if (alreadySent) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <Alert>
          <Check />
          <AlertTitle>Obecność potwierdzona</AlertTitle>
          <AlertDescription>
            Twoja obecność została już zapisana.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={dataSentLoadingStatus === "loading"}>
        <AlertDialogContent>
          <RocketIcon className="h-8 w-8 animate-spin" />
          <p className="mt-4">Wysyłanie danych...</p>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="w-96 p-6 bg-slate-900 rounded-xl text-white">
          <Image
            src={require("../logo.png")}
            className="h-32 w-32 mx-auto mb-6"
            alt="logo"
          />
          <h1 className="text-3xl font-bold text-center">Rekolekcje 2024</h1>
          <h2 className="text-xl opacity-80 text-center">
            Weryfikacja obecności
          </h2>
          {!userLocation && (
            <Alert variant="destructive" className="mt-3">
              <LocateIcon className="h-4 w-4" />
              <AlertTitle>Poczekaj</AlertTitle>
              <AlertDescription>Lokalizacja jest pobierana...</AlertDescription>
            </Alert>
          )}
          {dataSentLoadingStatus === "error" && (
            <Alert variant="destructive" className="mt-3">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Błąd</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4">
            <Input
              placeholder="Imię i nazwisko"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ClassSelection
              defaultValue={selectedClass}
              onSelect={setSelectedClass}
            />
            <Input
              className="mt-3"
              placeholder="Unikalny kod"
              value={uniqueCode}
              onChange={(e) => setUniqueCode(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full disabled:bg-gray-600"
              disabled={!userLocation || !name || !selectedClass || !uniqueCode}
              onClick={handleSubmit}
            >
              Zatwierdź
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
