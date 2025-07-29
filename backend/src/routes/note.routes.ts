import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);

export default router;
