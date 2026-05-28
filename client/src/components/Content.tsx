import PerfumeCard from "./PerfumeCard";

interface ContentProps {
  showHamburgerMenu: boolean;
  showAddPerfume: boolean;
  perfumes: Perfume[];
}

interface Perfume {
  id: number;
  brand: string;
  name: string;
  image_url: string;
  description?: string;
  total_rating?: number;
}

const Content = ({
  showHamburgerMenu,
  showAddPerfume,
  perfumes,
}: ContentProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${showHamburgerMenu || showAddPerfume ? " blur-sm" : ""}`}
    >
      <div className="flex items-center justify-between w-full px-3!">
        <div>
          <h1 className="font-bold text-lg">Discover & Review</h1>
          <p className="text-gray-400 text-xs">Your favorite perfumes</p>
        </div>
        <div>
          <img src="./logo.png" alt="logo" className="w-25" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 m-1!">
        {perfumes.map((perfume: Perfume) => (
          <PerfumeCard
            key={perfume.id}
            id={perfume.id}
            brand={perfume.brand}
            name={perfume.name}
            image_url={perfume.image_url}
            total_rating={perfume.total_rating}
          />
        ))}
      </div>
    </div>
  );
};

export default Content;
