import { MdOutlineSettingsInputComponent } from "react-icons/md";

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
      className={`bg-white/70 h-13 flex items-center justify-between shadow-2xl shadow-stone-800/50 p-2! ${showHamburgerMenu || showAddPerfume ? "blur-sm" : ""}`}
    >
      <div className="gap-1 flex items-center">
        <MdOutlineSettingsInputComponent
          size={24}
          className="cursor-pointer"
          onClick={() => setShowHamburgerMenu(true)}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-20 rounded-2xl border-gray-400 border-[1.9px] p-1! outline-none bg-white/50 focus:border-purple-500 transition-colors duration-1000 text-sm"
          onChange={(e) => (setSearchQuery(e.target.value), setOffset(0))}
        />
      </div>

      <div className="flex gap-2 items-center">
        {role == "admin" && (
          <button
            className="rounded-2xl bg-purple-500 text-white p-1! cursor-pointer hover:bg-fuchsia-700"
            onClick={() => setShowAddPerfume(true)}
          >
            Add Perfume
          </button>
        )}
        <button
          className="rounded-2xl bg-orange-400 text-white p-1! cursor-pointer hover:bg-orange-600"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
