/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import Content from "./Content";
import Header from "./Header";
import SideBarFilter from "./SideBarFilter";
import AddPerfumeDialog from "./AddPerfumeDialog";

interface HomeProps {
  onLogout: () => void;
  role: string;
}

interface Perfume {
  id: number;
  brand: string;
  name: string;
  image_url: string;
  description?: string;
  total_rating?: number;
}

const Home = ({ onLogout, role }: HomeProps) => {
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showAddPerfume, setShowAddPerfume] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const fetchPerfumes = async (
    searchQuery: string,
    filter: string,
    limit: number,
    offset: number,
  ) => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("searchQuery", searchQuery);
      if (filter) params.append("filter", filter);
      params.append("limit", limit.toString());
      params.append("offset", offset.toString());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      const data = await response.json();
      setPerfumes(data);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    }
  };

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + limit);
    setLimit((prevLimit) => prevLimit + 20);
  };

  useEffect(() => {
    fetchPerfumes(searchQuery, filter, limit, offset);
  }, [searchQuery, filter, limit, offset]);
  return (
    <div className="flex flex-col">
      <Header
        setShowHamburgerMenu={setShowHamburgerMenu}
        setShowAddPerfume={setShowAddPerfume}
        onLogout={onLogout}
        role={role}
        setSearchQuery={setSearchQuery}
      />
      <Content
        showHamburgerMenu={showHamburgerMenu}
        showAddPerfume={showAddPerfume}
        perfumes={perfumes}
      />
      {showHamburgerMenu && (
        <SideBarFilter
          setShowHamburgerMenu={setShowHamburgerMenu}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          setFilter={setFilter}
        />
      )}
      {showAddPerfume && (
        <AddPerfumeDialog
          setShowAddPerfume={setShowAddPerfume}
          fetchPerfumes={fetchPerfumes}
        />
      )}
    </div>
  );
};

export default Home;
