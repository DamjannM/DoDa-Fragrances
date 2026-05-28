import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface PerfumeCardProps {
  id: number;
  brand: string;
  name: string;
  image_url: string;
  total_rating?: number;
}

const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => {
    if (rating >= i + 1) {
      return <FaStar key={i} color="gold" />;
    } else if (rating >= i + 0.5) {
      return <FaStarHalfAlt key={i} color="gold" />;
    } else {
      return <FaRegStar key={i} color="gold" />;
    }
  });
};

const PerfumeCard = ({
  id,
  brand,
  name,
  image_url,
  total_rating,
}: PerfumeCardProps) => {
  return (
    <Link to={`/${id}`}>
      <div className="w-45 h-45  bg-secondary flex flex-col rounded-2xl cursor-pointer border-gray-100 border p-2!">
        <div className="flex-1 flex items-start justify-center">
          <img
            src={image_url}
            alt="Perfume Photo"
            className="w-30 h-25 object-contain"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-center items-start wrap-break-word whitespace-normal flex flex-col">
            <span className="inline-block max-w-full font-bold">{brand}</span>
            <span className="inline-block text-gray-400">{name}</span>
          </p>
          {total_rating !== undefined && (
            <p className="flex text-sm gap-1">{renderStars(total_rating)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PerfumeCard;
