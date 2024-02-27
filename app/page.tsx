"use client";
import React, { useEffect, useState } from "react";
import logo from "@/logo.png";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ClassSelection from "@/components/ClassSelection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LocateIcon, RocketIcon } from "lucide-react";
import { addImage, addPresenceRecord } from "@/lib/appwriteClient";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import CameraComponent from "@/components/CameraComponent";

function page() {
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(
    null
  );

  const nameRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  const [picture, setPicture] = useState<string | ArrayBuffer | null>("");

  const [selectedClass, setSelectedClass] = useState(
    localStorage.getItem("class") || ""
  );

  const [dataSentLoadingStatus, setDataSentLoadingStatus] = useState<
    "not-sent" | "loading" | "sent" | "error"
  >("not-sent");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value); // Update the name state with input value
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
          alert(error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    setName(localStorage.getItem("name") || "");
    getUserLocation();
  }, [typeof window !== "undefined"]);

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
                <div className="mt-3">
                  <CameraComponent
                    setData={(data) => {
                      // console.log(data);
                      setPicture(data);
                    }}
                  />
                </div>

                <button
                  className="bg-blue-600 transition-all duration-300 text-white px-4 py-2 rounded-lg mt-4 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55 w-full"
                  disabled={!userLocation || !name || !selectedClass}
                  onClick={() => {
                    setDataSentLoadingStatus("loading");
                    localStorage.setItem("name", name);
                    addImage(
                      picture as ArrayBuffer,
                      name.split(" ")[0] + selectedClass
                    );
                    addPresenceRecord({
                      name,
                      surname: "",
                      class: selectedClass,
                      time: new Date(),
                      isInChurch: true,
                      latitude: userLocation?.coords.latitude || 0,
                      longitude: userLocation?.coords.longitude || 0,
                    })
                      .then(() => {
                        setDataSentLoadingStatus("sent");
                      })
                      .catch((e) => {
                        console.error(e);
                        setDataSentLoadingStatus("error");
                      });
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

export default page;
