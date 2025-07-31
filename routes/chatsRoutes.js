import { Router } from "express";
import { chatbot } from "../controllers/chatbotController.js";

const router = Router()

router.post("/bot", chatbot )

export default router