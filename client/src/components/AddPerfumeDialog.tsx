import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

interface AddPerfumeDialogProps {
  setShowAddPerfume: (value: boolean) => void;
  fetchPerfumes: (
    searchQuery: string,
    filter: string,
    limit: number,
    offset: number,
  ) => Promise<void>;
}

const AddPerfumeDialog = ({
  setShowAddPerfume,
  fetchPerfumes,
}: AddPerfumeDialogProps) => {
  const [brand, setBrand] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image_url, setImageUrl] = React.useState("");

  async function handleSubmit() {
    if (!brand || !name || !description || !image_url) {
      return alert("Please fill in all fields");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/perfumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ brand, name, description, image_url }),
      });
      if (!response.ok) {
        throw new Error("Failed to add perfume");
      }
      const data = await response.json();
      console.log("Perfume added:", data);
      fetchPerfumes("", "", 20, 0);
      setShowAddPerfume(false);
    } catch (error) {
      console.error("Error adding perfume:", error);
      alert("Error adding perfume. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[70%] max-w-md bg-white p-2! rounded-2xl shadow-2xl relative h-auto min-h-100 flex flex-col">
        <IoMdArrowRoundBack
          size={20}
          className="cursor-pointer absolute top-2 right-2"
          onClick={() => setShowAddPerfume(false)}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Add New Perfume
        </h2>
        <form className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            placeholder="Brand"
            className="p-0.5! w-full px-4 py-3 border-b border-b-amber-200 text-center  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setBrand(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="p-0.5! w-full px-4 py-3 border-b border-b-amber-200 text-center  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="p-0.5! w-full px-4 py-3 border-b border-b-amber-200 text-center  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="p-0.5! w-full px-4 py-3 border-b border-b-amber-200 text-center  rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <div className="flex-1" />
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-md"
            onClick={handleSubmit}
          >
            Add Perfume
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPerfumeDialog;
