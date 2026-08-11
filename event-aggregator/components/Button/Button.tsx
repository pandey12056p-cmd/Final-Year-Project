type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="bg-blue-700 hover:bg-blue-800 transition text-white px-6 py-3 rounded-xl font-semibold">
      {children}
    </button>
  );
}