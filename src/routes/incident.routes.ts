import { Router, type Request, type Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";
import { editIncident, getIncidentByID, getIncidents, postIncident, replaceIncident } from "../controllers/incident.controllers.js";
import { deleteIncident } from "../repositories/incident.repository.js";

const router = Router();

router.use(authenticateToken);


router.get("/", async (req: Request, res: Response) => {
  return getIncidents(req, res);
});

router.get("/:id", async (req: Request, res: Response) => {
  return getIncidentByID(req, res);

});

router.post("/", postIncident);

router.put( "/:id", authorizeRole("admin"), replaceIncident);

router.patch( "/:id", authorizeRole("admin"), editIncident);

router.delete(
  "/:id",
  authorizeRole("admin"),
  deleteIncident
);

export default router;
