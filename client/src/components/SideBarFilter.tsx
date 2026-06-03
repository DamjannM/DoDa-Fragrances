/* eslint-disable react-hooks/exhaustive-deps */
// import { useState } from "react";
import { useEffect, useState } from "react";
import { MdDone } from "react-icons/md";

interface SideBarFilterProps {
  showHamburgerMenu: boolean;
  setShowHamburgerMenu: (value: boolean) => void;
  setSelectedBrands: (brands: string[]) => void;
  setFilter: (filter: string) => void;
  selectedBrands: string[];
  setOffset: (offset: number) => void;
}

const SideBarFilter = ({
  showHamburgerMenu,
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

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setOffset(0);
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
    <div
      className={`fixed inset-0 z-50 flex bg-black/50 transition-opacity duration-200 ${showHamburgerMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`fixed left-0 top-0 h-full w-[60%] max-w-sm bg-white p-4 z-50 overflow-y-auto transition-transform duration-300 ease-out rounded rounded-r-2xl ${showHamburgerMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <MdDone
          size={20}
          className="cursor-pointer top-1 right-1 absolute"
          onClick={() => setShowHamburgerMenu(false)}
        />
        <h2 className="text-lg font-semibold ml-1!">Filter by Brand</h2>
        <p className="text-gray-400 ml-1! text-sm">Select a brand</p>
        <ul className="flex flex-col m-2!">
          {brands.map((brand, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:bg-gray-200 p-2! flex items-center justify-between border border-gray-100 rounded-2xl m-0.5! ${selectedBrands.includes(brand) ? "bg-purple-50" : ""}`}
              onClick={() => {
                handleCheckboxChange(brand);
              }}
            >
              {brand}{" "}
              {selectedBrands.includes(brand) ? (
                <MdDone
                  size={16}
                  className="ml-1 bg-primary text-white rounded-2xl p-0.5!"
                />
              ) : (
                <MdDone
                  size={16}
                  className="ml-1 bg-white text-white rounded-2xl p-0.5! border border-gray-300"
                />
              )}
            </li>
          ))}
        </ul>
        <button
          className=" bg-linear-to-r from-primary to-purple-400 items-center rounded-2xl w-[85%] ml-4! mb-2! text-xs py-2! text-white"
          onClick={() => {
            clearAllFilters();
          }}
        >
          Clear All
        </button>
      </div>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => setShowHamburgerMenu(false)}
      />
    </div>
  );
};

export default SideBarFilter;
