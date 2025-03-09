export const getGeolocation = ({
  onUpdate,
}: {
  onUpdate: (position: GeolocationPosition) => void;
}) => {
  if (!navigator.geolocation) {
    alert(
      "Przeglądarka nie ma dostępu do lokalizacji, podejdź do zakrystii aby zweryfikować obecność."
    );
    throw new Error("Geolocation is not supported by your browser");
  }
  navigator.geolocation.watchPosition(
    onUpdate,
    (error) => {
      throw new Error(`Unable to retrieve your location: ${error.message}`);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};
