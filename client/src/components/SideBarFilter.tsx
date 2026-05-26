/* eslint-disable react-hooks/exhaustive-deps */
// import { useState } from "react";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";

interface SideBarFilterProps {
  setShowHamburgerMenu: (value: boolean) => void;
  setSelectedBrands: (brands: string[]) => void;
  setFilter: (filter: string) => void;
  selectedBrands: string[];
  setOffset: (offset: number) => void;
}

const SideBarFilter = ({
  setShowHamburgerMenu,
  selectedBrands,
  setSelectedBrands,
  setFilter,
  setOffset,
}: SideBarFilterProps) => {
  const [brands, setBrands] = useState<string[]>([]);

  const fetchBrands = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/brands`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const data = await response.json();
      console.log(data);
      console.log(brands);
      const brandNames = data.map((item: { brand: string }) => item.brand);
      setBrands(brandNames);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCheckboxChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
      setOffset(0);
    } else {
      setSelectedBrands([...selectedBrands, brand]);
      setOffset(0);
    }
  };

  useEffect(() => {
    if (selectedBrands.length > 0) {
      const brandList = selectedBrands.map((brand) => `${brand}`).join(", ");
      setFilter(brandList);
    } else {
      setFilter("");
    }
  }, [selectedBrands, setFilter]);

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50">
      <div className="fixed left-0 top-0 h-full w-[60%] bg-white p-4 z-50 overflow-y-auto">
        <MdDone
          size={20}
          className="cursor-pointer top-1 right-1 absolute"
          onClick={() => setShowHamburgerMenu(false)}
        />
        <h2 className="text-lg font-bold ml-1!">Filter by Brand</h2>
        <ul className="flex flex-col">
          {brands.map((brand, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:bg-gray-200 p-2! flex items-center justify-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} ${selectedBrands.includes(brand) ? "text-pink-900 font-bold" : ""}`}
              onClick={() => {
                handleCheckboxChange(brand);
              }}
            >
              {brand}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => setShowHamburgerMenu(false)}
      />
    </div>
  );
};

export default SideBarFilter;
