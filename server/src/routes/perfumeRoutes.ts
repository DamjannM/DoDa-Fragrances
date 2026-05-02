import express from "express";
import db from "../db";

const router = express.Router();

// create an perfume
router.post("/", (req, res) => {
  const { brand, name, description, image_url } = req.body;
  const insertPerfume = db.prepare(
    `INSERT INTO perfumes (user_id, brand, name, description, image_url) VALUES (?, ?, ?, ?, ?)`,
  );
  const result = insertPerfume.run(
    req.userId!,
    brand,
    name,
    description,
    image_url,
  );

  res.json({ brand, name, description, image_url });
});

//fetch all perfumes with filter and search
router.get("/", (req, res) => {
  const { searchQuery = "", filter = "", limit = 20, offset = 0 } = req.query;

  let whereClause = "WHERE 1=1";
  const params: any[] = [];

  // Add search filter
  if (searchQuery) {
    whereClause +=
      " AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)";
    const searchTerm = `%${searchQuery}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Add custom filter
  if (filter) {
    whereClause += ` AND ${filter}`;
  }

  const getPerfumes = db.prepare(
    `SELECT p.*, IFNULL(AVG(r.total_rating), 0) AS total_rating
     FROM perfumes p
     LEFT JOIN reviews r ON p.id = r.perfume_id
     ${whereClause}
     GROUP BY p.id
     LIMIT ? OFFSET ?`,
  );

  params.push(Number(limit), Number(offset));
  const perfumes = getPerfumes.all(...params);
  res.json(perfumes);
});

// fetch all unique brands
router.get("/brands", (req, res) => {
  const getBrands = db.prepare(
    `SELECT DISTINCT brand FROM perfumes ORDER BY brand`,
  );
  const brands = getBrands.all();
  res.json(brands);
});

router.get("/:id", (req, res) => {
  const getPerfume = db.prepare(
    `SELECT p.*, IFNULL(AVG(r.total_rating), 0) AS total_rating
     FROM perfumes p
     LEFT JOIN reviews r ON p.id = r.perfume_id
     WHERE p.id = ?
     GROUP BY p.id`,
  );
  const perfume = getPerfume.get(req.params.id);
  res.json(perfume);
});

// create review
router.post("/reviews", (req, res) => {
  const { perfume_id, scent, projection, longevity, comment } = req.body;
  const insertPerfume = db.prepare(
    `INSERT INTO reviews (user_id, perfume_id, scent, projection, longevity, comment) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  const result = insertPerfume.run(
    req.userId!,
    perfume_id,
    scent,
    projection,
    longevity,
    comment,
  );

  res.json({
    perfume_id,
    scent,
    projection,
    longevity,
    comment,
    total_rating: result.lastInsertRowid,
  });
});

router.get("/reviews/:perfume_id", (req, res) => {
  const getReviews = db.prepare(
    `SELECT r.*, u.email FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.perfume_id = ?`,
  );
  const reviews = getReviews.all(req.params.perfume_id);
  res.json(reviews);
});

router.get("/reviews/:perfume_id/id", (req, res) => {
  const getReview = db.prepare(
    `SELECT r.*, u.email FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.perfume_id = ? AND r.user_id = ?`,
  );
  const review = getReview.get(req.params.perfume_id, req.userId);
  res.json(review);
});
export default router;
