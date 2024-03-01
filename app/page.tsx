"use client";
import React, { useEffect, useRef, useState } from "react";
import logo from "@/logo.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ClassSelection from "@/components/ClassSelection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocateIcon, RocketIcon, Check, Loader2 } from "lucide-react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import CameraComponent from "@/components/CameraComponent";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [alreadySent, setAlreadySent] = useState(false);

  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  // const [picture, setPicture] = useState<string | ArrayBuffer | null>("");
  const [uniqueCode, setUniqueCode] = useState<string | undefined>("");

  const [selectedClass, setSelectedClass] = useState("");

  const [dataSentLoadingStatus, setDataSentLoadingStatus] = useState<
    "not-sent" | "loading" | "sent" | "error"
  >("not-sent");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value); // Update the name state with input value
  };

  const handleUnuqueCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueCode(event.target.value);
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      // Get the user's location
      // check if the user has allowed to share their location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
        },
        (error) => {
          if (error.PERMISSION_DENIED) {
            alert(
              "Dostęp do lokalizaji jest wymagany do zweryfikowania obecności"
            );
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    setSelectedClass(localStorage.getItem("class") || "");
    getUserLocation();

    const savedToday =
      localStorage.getItem("lastSaved") ==
      `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;

    setAlreadySent(savedToday);
    setLoading(false);
  }, [typeof window !== "undefined"]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100vh] justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Ładowanie, proszę czekać</p>
      </div>
    );
  }

  if (alreadySent) {
    return (
      <div className="flex flex-col min-h-[100vh] justify-center items-center">
        <div
          className="w-[96%] lg:w-2/5 h-full
         lg:h-[80vh] flex flex-col bg-slate-900 rounded-xl"
        >
          <div className="flex flex-col items-center justify-center p-3">
            <Image
              src={logo}
              className="h-[128px] w-[128px] rounded mb-12 mt-12"
              alt="logo"
            />
            <h1 className="text-3xl font-bold">Rekolekcje 2024</h1>
            <h2 className="text-xl opacity-80 mb-3">Weryfikacja obecności</h2>

            <Alert>
              <Check></Check>
              <AlertTitle>Obecność potwierdzona</AlertTitle>
              <AlertDescription>
                Twoja obecność jest juz zapisana.<br></br>
                <p className="opacity-60">
                  Imie i nazwisko: {name}
                  <br></br>
                  Klasa: {selectedClass}
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
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

      <div className="flex flex-col min-h-[100vh] justify-center items-center">
        <div
          className="w-[96%] lg:w-2/5 h-full
         lg:h-[80vh] flex flex-col bg-slate-900 rounded-xl"
        >
          <div className="flex flex-col items-center justify-center p-3">
            <Image
              src={logo}
              className="h-[128px] w-[128px] rounded mb-12 mt-12"
              alt="logo"
            />
            <h1 className="text-3xl font-bold">Rekolekcje 2024</h1>
            <h2 className="text-xl opacity-80">Weryfikacja obecności</h2>

            <p className="opacity-50 text-center">
              Podaj swoje imię i nazwisko oraz wstaw zdjęcie, a następnie
              kliknij przycisk "Zatwierdź"
            </p>
            {!userLocation && (
              <Alert variant={"destructive"} className="mt-3">
                <LocateIcon className="h-4 w-4" />
                <AlertTitle>Poczekaj</AlertTitle>
                <AlertDescription>
                  Lokalizacja jest pobierana...
                </AlertDescription>
              </Alert>
            )}
            {dataSentLoadingStatus === "sent" && (
              <Alert variant={"default"} className="mt-3">
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Sukces</AlertTitle>
                <AlertDescription>
                  Dane zostały wysłane pomyślnie
                </AlertDescription>
              </Alert>
            )}
            {dataSentLoadingStatus === "error" && (
              <Alert variant={"destructive"} className="mt-3">
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Błąd</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            {dataSentLoadingStatus !== "sent" && (
              <div className="flex flex-col mt-3 w-full lg:w-2/5 justify-center sm:gap-3">
                <Input
                  placeholder="Imię i nazwisko"
                  ref={nameRef}
                  value={name}
                  onChange={handleNameChange}
                />
                <ClassSelection
                  defaultValue={selectedClass}
                  onSelect={(val) => {
                    setSelectedClass(val);
                    localStorage.setItem("class", val);
                  }}
                />
                <Input
                  placeholder="Unikalny kod"
                  // ref={nameRef}
                  value={uniqueCode}
                  onChange={handleUnuqueCode}
                />
                {/* <div className="mt-3"> */}
                {/* <CameraComponent
                    setData={(data) => {
                      // console.log(data);
                      setPicture(data);
                    }}
                  /> */}
                {/* </div> */}

                <button
                  className="bg-blue-600 transition-all duration-300 text-white px-4 py-2 rounded-lg mt-4 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55 w-full"
                  disabled={
                    !userLocation || !name || !selectedClass || !uniqueCode
                  }
                  onClick={async () => {
                    setDataSentLoadingStatus("loading");
                    localStorage.setItem("name", name);

                    try {
                      await axios.post("/api/presence", {
                        name: name.split(" ")[0],
                        surname: name.split(" ")[1],
                        class: selectedClass,
                        latitude: userLocation?.coords.latitude || 0,
                        longitude: userLocation?.coords.longitude || 0,
                        code: uniqueCode,
                      });
                      setDataSentLoadingStatus("sent");
                      localStorage.setItem(
                        "lastSaved",
                        `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
                      );
                    } catch (e) {
                      const errorResponse = e as AxiosError;
                      // console.log(errorResponse.code);

                      switch (errorResponse.response?.status) {
                        case 404:
                          setErrorMessage("Nieprawidłowy kod");
                          break;
                        case 403:
                          setErrorMessage("Kod został już użyty");
                          break;
                        case 400:
                          setErrorMessage("Pola nie zostały uzupełnione");
                          break;
                      }
                      setDataSentLoadingStatus("error");
                    }

                    // addPresenceRecord({
                    //   name,
                    //   surname: "",
                    //   class: selectedClass,
                    //   time: new Date(),
                    //   isInChurch: true,
                    //   latitude: userLocation?.coords.latitude || 0,
                    //   longitude: userLocation?.coords.longitude || 0,
                    // })
                    //   .then(() => {
                    //     setDataSentLoadingStatus("sent");
                    //   })
                    //   .catch((e) => {
                    //     console.error(e);
                    //     setDataSentLoadingStatus("error");
                    //   });
                  }}
                >
                  Zatwierdź
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
