import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";
import {
  deleteDino,
  getDinoByID,
  getDinos,
  patchDino,
  postDino,
} from "../controllers/dinosaur.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getDinos);
router.get("/:id", getDinoByID);
router.post("/", authorizeRole("admin"), postDino);
router.patch("/:id", authorizeRole("admin"), patchDino);
router.delete("/:id", authorizeRole("admin"), deleteDino);

export default router;
