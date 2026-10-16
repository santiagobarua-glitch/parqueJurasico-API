import { Router } from "express";
import {
  deleteRecint,
  getRecintByID,
  getRecints,
  patchRecint,
  postRecint,
} from "../controllers/recint.controller.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getRecints);
router.get("/:id", getRecintByID);
router.post("/", authorizeRole("admin"), postRecint);
router.put("/:id", authorizeRole("admin"), patchRecint);
router.patch("/:id", authorizeRole("admin"), patchRecint);
router.delete("/:id", authorizeRole("admin"), deleteRecint);

export default router;
