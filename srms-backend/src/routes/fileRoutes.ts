import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  getCertificate,
  getReportCard,
  getPhoto,
  getQR,
  getPublicCertificate,
  getPublicReportCard,
  getPublicPhoto
} from "../controllers/fileController";

const router = Router();

router.get("/certificate/:recordId", requireAuth, getCertificate);
router.get("/report/:recordId", requireAuth, getReportCard);
router.get("/photo/:recordId", requireAuth, getPhoto);
router.get("/qr/:recordId", requireAuth, getQR);


router.get("/public/certificate/:recordId", getPublicCertificate);
router.get("/public/report/:recordId", getPublicReportCard);
router.get("/public/photo/:recordId", getPublicPhoto);

export default router;