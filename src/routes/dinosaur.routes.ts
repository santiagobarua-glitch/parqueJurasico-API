import {Router, Request, Response} from "express";
import { DinoRepository } from "../repositories/dinosaur.repository.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";
import { getDinos, patchDino, postDino } from "../controllers/dinosaur.controller.js";

const router = Router();


router.get("/", getDinos);

// GET /dinosaurs/:id
router.get("/:id", async (req: Request, res: Response) => {
  
});

router.post("/", authorizeRole("admin"), async (req: Request, res: Response) => {
  
});

router.put("/:id", authorizeRole("admin"), postDino);
router.patch("/:id", authorizeRole("admin"), patchDino);

router.delete( "/:id", authorizeRole("admin"), async (req: Request, res: Response) => {

}
);

export default router;
