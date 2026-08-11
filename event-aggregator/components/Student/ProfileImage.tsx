import UploadProfileImage from "./UploadProfileImage";

type Props = {
  name: string;
  image?: string | null;
};

export default function ProfileImage({
  name,
  image,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

      {image ? (
        <img
          src={image}
          alt={name}
          className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-blue-600"
        />
      ) : (
        <div className="w-36 h-36 rounded-full bg-blue-700 text-white text-6xl font-bold flex items-center justify-center mx-auto">
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      <h2 className="mt-5 text-2xl font-bold text-gray-800">
        {name}
      </h2>

      <p className="text-gray-500 mt-2">
        Student Profile
      </p>

      <UploadProfileImage />

    </div>
  );
}