import express from "express";
import prisma from "../prismaClient";

const router = express.Router();

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
  const { filter, limit, offset } = req.query;
  let { searchQuery } = req.query;

  searchQuery =
    typeof req.query.search === "string" ? req.query.search : undefined;

  const brands =
    typeof req.query.filter === "string"
      ? req.query.filter.split(",").map((b) => b.trim())
      : [];

  const perfumes = await prisma.perfume.findMany({
    where: {
      AND: [
        searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery, mode: "insensitive" } },
                { brand: { contains: searchQuery, mode: "insensitive" } },
              ],
            }
          : {},
        filter
          ? {
              ...(brands.length > 0 && {
                OR: brands.map((brand) => ({
                  brand: {
                    in: brands,
                  },
                })),
              }),
            }
          : {},
      ],
    },
    orderBy: {
      reviews: {
        _count: "asc",
      },
    },

    skip: Number(offset),
    take: Number(limit),
  });

  const ratings = await prisma.review.groupBy({
    by: ["perfume_id"],
    _avg: {
      total_rating: true,
    },
  });

  const ratingMap = new Map(
    ratings.map((r: any) => [
      r.perfume_id,
      Math.round(r._avg.total_rating * 100) / 100,
    ]),
  );

  const result = perfumes.map((p: any) => ({
    ...p,
    total_rating: ratingMap.get(p.id) ?? 0,
  }));
  res.json(result);
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
  const { perfume_id, scent, projection, longevity, comment } = req.body;
  const result = await prisma.review.create({
    data: {
      user_id: req.userId!,
      perfume_id,
      scent,
      projection,
      longevity,
      comment,
      total_rating:
        Math.round(((scent + projection + longevity) / 3) * 100) / 100,
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
