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
      className={`flex flex-col items-center justify-center gap-4${showHamburgerMenu || showAddPerfume ? " blur-sm" : ""}`}
    >
      <div className="grid grid-cols-2 gap-4 m-1!">
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
