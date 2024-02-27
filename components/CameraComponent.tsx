import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CameraComponent = ({
  setData,
}: {
  setData(data: string | ArrayBuffer | null): void;
}) => {
  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Use the image data (reader.result) here as needed
        // console.log("Image captured:", reader.result);
        setData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        id="picture"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default CameraComponent;
