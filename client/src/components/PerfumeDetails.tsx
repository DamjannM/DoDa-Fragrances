import { useState, useEffect } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";

// interface PerfumeDetailsProps {
//   id: number;
// }

interface Perfume {
  id: number;
  brand: string;
  name: string;
  image_url: string;
  description?: string;
  total_rating?: number;
}

interface Review {
  id: number;
  perfume_id: number;
  user_id: number;
  scent: number;
  projection: number;
  longevity: number;
  total_rating: number;
  comment: string;
  email: string;
}

const PerfumeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [scent, setScent] = useState<number>(0);
  const [hoveredScent, setHoveredScent] = useState<number>(0);
  const [projection, setProjection] = useState<number>(0);
  const [hoveredProjection, setHoveredProjection] = useState<number>(0);
  const [longevity, setLongevity] = useState<number>(0);
  const [hoveredLongevity, setHoveredLongevity] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [userReview, setUserReview] = useState<Review[] | null>(null);
  const [isRatedByUser, setIsRatedByUser] = useState<boolean>(false);

  async function handleSubmitRating() {
    if (scent === 0 || projection === 0 || longevity === 0) {
      alert("Please provide ratings for scent, projection, and longevity.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            perfume_id: perfume?.id,
            scent: scent,
            projection: projection,
            longevity: longevity,
            comment: comment,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }
      const data = await response.json();
      console.log("Rating submitted:", data);
      fetchPerfumeDetails(perfume!.id);
      fetchReviews(perfume!.id);
      setComment("");
      setIsRatedByUser(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  }

  async function updateRating() {
    if (scent === 0 || projection === 0 || longevity === 0) {
      alert("Please provide ratings for scent, projection, and longevity.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/reviews`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            perfume_id: perfume?.id,
            scent: scent,
            projection: projection,
            longevity: longevity,
            comment: comment,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update rating");
      }
      const data = await response.json();
      console.log("Rating updated:", data);
      fetchPerfumeDetails(perfume!.id);
      fetchReviews(perfume!.id);
      setComment("");
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  }

  async function fetchPerfumeDetails(id: number) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/${id}`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch perfume details");
      }
      const data = await res.json();
      setPerfume(data);
    } catch (error) {
      console.error("Error fetching perfume details:", error);
    }
  }

  async function fetchReviews(perfume_id: number) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/reviews/${perfume_id}`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await res.json();
      setUserReview(data);
      console.log("Reviews fetched:", data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  async function fetchUserReview(perfume_id: number) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/perfumes/reviews/${perfume_id}/id`,
        {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch user review");
      }
      const data = await res.json();
      setScent(data.scent);
      setProjection(data.projection);
      setLongevity(data.longevity);
      setComment(data.comment);
      setIsRatedByUser(true);
      console.log("User review fetched:", data);
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  }

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        fetchPerfumeDetails(parsedId);
        fetchReviews(parsedId);
        fetchUserReview(parsedId);
      }
    }
  }, [id]);

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

  if (!perfume) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-screen h-screen bg-white p-8 relative flex items-center justify-center">
          <span className="text-gray-500 text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white touch-scroll">
        <div className="w-screen min-h-screen relative mx-1 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4">
          <IoMdArrowRoundBack
            size={28}
            className="cursor-pointer absolute top-2 left-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            onClick={() => navigate("/")}
          />

          <div className="flex flex-col items-center gap-4">
            <img
              src={perfume.image_url}
              alt={perfume.name}
              className="w-32 h-32 object-contain"
            />

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {perfume.brand}
              </h2>
              <p className="text-lg text-gray-600 mt-1">{perfume.name}</p>
            </div>

            {perfume.total_rating !== undefined && (
              <div className="flex ">
                <span className="flex items-center">
                  {renderStars(perfume.total_rating)}
                </span>

                <span className="ml-2 text-gray-600">
                  ({Math.round(perfume.total_rating! * 10) / 10})
                </span>
              </div>
            )}

            {perfume.description && (
              <div className="w-full mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Description
                </h3>
                <p className="text-gray-600">{perfume.description}</p>
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
            <p className="text-gray-700 font-medium">Scent:</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-2xl cursor-pointer transition-colors"
                  onClick={() => setScent(i + 1)}
                  onMouseEnter={() => setHoveredScent(i + 1)}
                  onMouseLeave={() => setHoveredScent(0)}
                >
                  {(hoveredScent || scent) >= i + 1 ? (
                    <span className="text-yellow-500">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <p className="text-gray-700 font-medium">Projection:</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-2xl cursor-pointer transition-colors"
                  onClick={() => setProjection(i + 1)}
                  onMouseEnter={() => setHoveredProjection(i + 1)}
                  onMouseLeave={() => setHoveredProjection(0)}
                >
                  {(hoveredProjection || projection) >= i + 1 ? (
                    <span className="text-yellow-500">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 mt-4">
            <p className="text-gray-700 font-medium">Longevity:</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-2xl cursor-pointer transition-colors"
                  onClick={() => setLongevity(i + 1)}
                  onMouseEnter={() => setHoveredLongevity(i + 1)}
                  onMouseLeave={() => setHoveredLongevity(0)}
                >
                  {(hoveredLongevity || longevity) >= i + 1 ? (
                    <span className="text-yellow-500">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center m-2!">
            <textarea
              className="w-11/12 h-24 p-1! border shadow-2xl shadow-amber-100 border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Write your review here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={200}
            />
          </div>
          <div className="flex justify-center items-center">
            {!isRatedByUser ? (
              <button
                className="rounded-2xl bg-orange-400 text-white p-1! cursor-pointer hover:bg-orange-600"
                onClick={handleSubmitRating}
              >
                Rate Perfume
              </button>
            ) : (
              <button
                className="rounded-2xl bg-orange-400 text-white p-1! cursor-pointer hover:bg-orange-600"
                onClick={updateRating}
              >
                Edit Review
              </button>
            )}
          </div>
          <div className="w-full mt-2!">
            <h3 className="text-lg font-semibold text-gray-800 mb-2!">
              User Reviews
            </h3>
            {userReview && userReview.length > 0 ? (
              userReview.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-2xl border-amber-100 shadow-lg shadow-amber-100 my-2! mx-1!"
                >
                  <div className="flex justify-between items-center ml-2! mr-2!">
                    <p className="text-gray-700">{review.email}</p>

                    {review.total_rating !== undefined && (
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-500 text-xl">
                            {review.total_rating! >= i + 1 ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 ml-2! wrap-break-word">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfumeDetails;
