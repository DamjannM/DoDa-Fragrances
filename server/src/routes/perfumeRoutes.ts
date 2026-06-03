import express from "express";
import prisma from "../prismaClient";

const router = express.Router();
//function for rounding total rating to nearest integer
const totalRatingRound = (value: number) => {
  const integerPart = Math.floor(value);
  const decimalPart = value - integerPart;

  return decimalPart < 0.5 ? integerPart : integerPart + 1;
};

// create an perfume
router.post("/", async (req, res) => {
  const { brand, name, description, image_url } = req.body;
  const insertPerfume = await prisma.perfume.create({
    data: {
      user_id: req.userId!,
      brand,
      name,
      description,
      image_url,
    },
  });

  res.json(insertPerfume);
});

//fetch all perfumes with filter and search
router.get("/", async (req, res) => {
  try {
    const limitNum = Math.min(Number(req.query.limit) || 50);
    const offsetNum = Number(req.query.offset) || 0;

    const searchQuery =
      typeof req.query.searchQuery === "string"
        ? req.query.searchQuery.trim()
        : undefined;

    const brands =
      typeof req.query.filter === "string"
        ? req.query.filter
            .split(",")
            .map((b) => b.trim())
            .filter(Boolean)
        : [];

    const where = {
      AND: [
        searchQuery
          ? {
              OR: [
                {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
                {
                  brand: {
                    contains: searchQuery,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {},
        brands.length > 0
          ? {
              brand: {
                in: brands,
              },
            }
          : {},
      ],
    };

    const [perfumes, perfumesCount] = await Promise.all([
      prisma.perfume.findMany({
        where,
        orderBy: [
          { total_rating: "desc" },
          { reviews_count: "asc" },
          { id: "asc" },
        ],
        skip: offsetNum,
        take: limitNum,
      }),

      prisma.perfume.count({
        where,
      }),
    ]);

    res.json({
      perfumes,
      count: perfumesCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch perfumes",
    });
  }
});

// fetch all unique brands
router.get("/brands", async (req, res) => {
  const brands = await prisma.perfume.findMany({
    distinct: ["brand"],
    orderBy: { brand: "asc" },
    select: { brand: true },
  });
  res.json(brands);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const perfume = await prisma.perfume.findUnique({
    where: { id },
    include: {
      reviews: {
        select: { total_rating: true },
      },
    },
  });

  if (!perfume) {
    return res.status(404).json({ message: "Perfume not found" });
  }

  const averageRating =
    perfume.reviews.length > 0
      ? perfume.reviews.reduce(
          (sum: number, r: any) => sum + (r.total_rating || 0),
          0,
        ) / perfume.reviews.length
      : 0;

  const result = {
    ...perfume,
    total_rating: averageRating,
  };

  res.json(result);
});

// create review
router.post("/reviews", async (req, res) => {
  try {
    const { perfume_id, scent, projection, longevity, comment } = req.body;

    const average = (scent + projection + longevity) / 3;

    const result = await prisma.review.create({
      data: {
        user_id: req.userId!,
        perfume_id,
        scent,
        projection,
        longevity,
        comment,
        total_rating: totalRatingRound(average),
      },
    });

    const stats = await prisma.review.aggregate({
      where: {
        perfume_id,
      },
      _avg: {
        total_rating: true,
      },
      _count: {
        id: true,
      },
    });

    await prisma.perfume.update({
      where: {
        id: perfume_id,
      },
      data: {
        total_rating: Number(stats._avg.total_rating ?? 0),
        reviews_count: stats._count.id,
      },
    });

    res.json({
      perfume_id,
      scent,
      projection,
      longevity,
      comment,
      total_rating: result.total_rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create review",
    });
  }
});

//update review
router.patch("/reviews", async (req, res) => {
  const { perfume_id, scent, projection, longevity, comment } = req.body;

  const review = await prisma.review.findFirst({
    where: {
      perfume_id,
      user_id: req.userId!,
    },
  });

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const updatedReview = await prisma.review.update({
    where: { id: review.id },
    data: {
      scent,
      projection,
      longevity,
      comment,
      total_rating: totalRatingRound((scent + projection + longevity) / 3),
    },
  });

  res.json(updatedReview);
});

router.get("/reviews/:perfume_id", async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { perfume_id: Number(req.params.perfume_id) },
    include: { user: { select: { email: true } } },
  });
  const result = reviews.map(({ user, ...rest }: any) => ({
    ...rest,
    email: user.email,
  }));
  res.json(result);
});

router.get("/reviews/:perfume_id/id", async (req, res) => {
  const review = await prisma.review.findFirst({
    where: {
      perfume_id: Number(req.params.perfume_id),
      user_id: req.userId!,
    },
    include: { user: { select: { email: true } } },
  });

  const result = {
    ...review,
    email: review!.user.email,
  };

  res.json(result);
});
export default router;
