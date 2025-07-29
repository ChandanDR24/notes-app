import { Request, Response } from "express";
import Note from "../models/Note";

export const createNote = async (req: any, res: Response) => {
  const { title, content } = req.body;
  try {
    const note = await Note.create({
      title,
      content,
      userId: req.user.userId,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const getNotes = async (req: any, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const deleteNote = async (req: any, res: Response) => {
  const noteId = req.params.id;
  try {
    await Note.findOneAndDelete({ _id: noteId, userId: req.user.userId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};
