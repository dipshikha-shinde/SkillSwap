import express from "express";
import {
  getPublicTeachers,
  getPublicTeacherById,
  getTopTeachers,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/teachers/top", getTopTeachers);
router.get("/teachers", getPublicTeachers);
router.get("/teachers/:id", getPublicTeacherById);

export default router;
