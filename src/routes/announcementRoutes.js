const express = require('express');
const router  = express.Router();
const upload = require('../utils/multer');
const announcementController = require('../controllers/announcementController');

router.get('/announcements', announcementController.getAllAnnouncements);
router.get('/announcements/:id', announcementController.getAnnouncementById);
router.post('/announcements', upload.single('fileUrl'), announcementController.createAnnouncement);
router.delete('/announcements/:id', announcementController.deleteAnnouncement);
router.put('/announcements/:id', upload.single('fileUrl'), announcementController.updateAnnouncement);

module.exports = router;