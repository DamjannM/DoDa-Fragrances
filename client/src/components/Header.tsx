import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

interface HeaderProps {
  showHamburgerMenu: boolean;
  showAddPerfume: boolean;
  setShowHamburgerMenu: (value: boolean) => void;
  setShowAddPerfume: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setOffset: (offset: number) => void;
  onLogout: () => void;
  role: string;
}

const Header = ({
  showHamburgerMenu,
  showAddPerfume,
  setShowHamburgerMenu,
  setShowAddPerfume,
  setSearchQuery,
  setOffset,
  onLogout,
  role,
}: HeaderProps) => {
  return (
    <div
      className={`bg-white/70 h-13 flex items-center justify-between {shadow-2xl shadow-stone-800/50} p-2! ${showHamburgerMenu || showAddPerfume ? "blur-sm" : ""}`}
    >
      <div className="gap-2 flex items-center">
        <HiOutlineMenuAlt2
          size={24}
          className="cursor-pointer"
          onClick={() => setShowHamburgerMenu(true)}
        />
        <div className="rounded-2xl border border-gray-100 flex gap-1 justify-between items-center bg-secondary max-w-45">
          <CiSearch color="gray" size={18} strokeWidth={1} />
          <input
            type="text"
            placeholder="Search perfumes..."
            className="py-2! outline-none text-sm text-gray-700 max-w-35"
            onChange={(e) => (setSearchQuery(e.target.value), setOffset(0))}
          />
        </div>
      </div>

      <div className="flex gap-3! items-center mr-1!">
        {role == "admin" && (
          <button
            className="flex items-center rounded-2xl bg-primary text-white p-2! cursor-pointer text-sm gap-1!"
            onClick={() => setShowAddPerfume(true)}
          >
            Add Perfume
            <LuPlus size={14} color="white" />
          </button>
        )}
        <FaRegUser className="cursor-pointer" onClick={onLogout} size={20} />
      </div>
    </div>
  );
};

export default Header;
