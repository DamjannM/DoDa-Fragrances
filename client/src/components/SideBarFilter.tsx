// import { useState } from "react";
import { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

interface SideBarFilterProps {
  setShowHamburgerMenu: (value: boolean) => void;
  setSelectedBrands: (brands: string[]) => void;
  setFilter: (filter: string) => void;
  selectedBrands: string[];
}

const SideBarFilter = ({
  setShowHamburgerMenu,
  selectedBrands,
  setSelectedBrands,
  setFilter,
}: SideBarFilterProps) => {
  const [brands, setBrands] = useState<string[]>([]);

  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5000/perfumes/brands", {
        method: "GET",
        credentials: "include",
      });
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
    } else {
      setSelectedBrands([...selectedBrands, brand]);
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
    <div className="fixed left-0 top-0 h-full w-[60%] bg-white p-4 z-50 overflow-y-auto">
      <IoMdArrowRoundBack
        size={20}
        className="cursor-pointer top-1 right-1 absolute"
        onClick={() => setShowHamburgerMenu(false)}
      />
      <h2 className="text-lg font-bold mb-4">Filter by Brand</h2>
      <ul className="flex flex-col gap-2">
        {brands.map((brand, index) => (
          <li
            key={index}
            className="cursor-pointer hover:bg-gray-200 p-2 flex items-center gap-2"
            onClick={() => {
              handleCheckboxChange(brand);
            }}
          >
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleCheckboxChange(brand)}
              className="w-4 h-4"
            />
            {brand}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarFilter;
