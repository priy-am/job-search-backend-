import { Router } from "express"
import { handleSubscribe } from "../controllers/subscriberController.js";

const router = Router()

router.post("/subscribe", handleSubscribe )

export default router;