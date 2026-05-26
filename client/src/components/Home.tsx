/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
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
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const loaderRef = useRef<HTMLDivElement | null>(null);

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

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes?${params.toString()}`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      const data = await response.json();
      setPerfumes((prevPerfumes) =>
        offset === 0 ? data.perfumes : [...prevPerfumes, ...data.perfumes],
      );
      setCount(data.count);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    }
  };

  useEffect(() => {
    fetchPerfumes(searchQuery, filter, limit, offset);
  }, [searchQuery, filter, limit, offset]);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    if (!currentLoader || perfumes.length >= count) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && perfumes.length < count) {
          setOffset((prevOffset) => prevOffset + limit);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(currentLoader);
    return () => observer.disconnect();
  }, [count, limit, perfumes.length]);

  return (
    <div className="flex flex-col">
      <Header
        showHamburgerMenu={showHamburgerMenu}
        showAddPerfume={showAddPerfume}
        setShowHamburgerMenu={setShowHamburgerMenu}
        setShowAddPerfume={setShowAddPerfume}
        onLogout={onLogout}
        role={role}
        setSearchQuery={setSearchQuery}
        setOffset={setOffset}
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
          setOffset={setOffset}
        />
      )}
      {showAddPerfume && (
        <AddPerfumeDialog
          setShowAddPerfume={setShowAddPerfume}
          fetchPerfumes={fetchPerfumes}
        />
      )}
      <div ref={loaderRef} className="h-1" />
    </div>
  );
};

export default Home;
