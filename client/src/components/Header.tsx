import { RxHamburgerMenu } from "react-icons/rx";

interface HeaderProps {
  setShowHamburgerMenu: (value: boolean) => void;
  setShowAddPerfume: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  onLogout: () => void;
  role: string;
}

const Header = ({
  setShowHamburgerMenu,
  setShowAddPerfume,
  setSearchQuery,
  onLogout,
  role,
}: HeaderProps) => {
  return (
    <div className="bg-white/70 h-13 flex items-center justify-between shadow-2xl shadow-stone-800/50 p-2!">
      <div className="gap-1 flex items-center">
        <RxHamburgerMenu
          size={24}
          className="cursor-pointer"
          onClick={() => setShowHamburgerMenu(true)}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-20 rounded-2xl border-amber-950 border-[1.9px] p-1! outline-none"
          onChange={(e) => setSearchQuery(e.target.value)}
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
