const express = require('express');
const router  = express.Router();
const upload = require('../utils/multer');
const announcementController = require('../controllers/announcementController');
const viewController = require('../controllers/viewController');

router.get('/announcements/search', announcementController.searchAnnouncements);
router.get('/announcements', announcementController.getAllAnnouncements);
router.get('/announcements/:id', announcementController.getAnnouncementById);
router.post('/announcements', upload.single('fileUrl'), announcementController.createAnnouncement);
router.delete('/announcements/:id', announcementController.deleteAnnouncement);
router.put('/announcements/:id', upload.single('fileUrl'), announcementController.updateAnnouncement);

// routes for announcement views
router.post('/announcements/:id/views', viewController.addAnnouncementView);
router.get('/announcements/:id/views', viewController.getAnnouncementViews);
router.get('/announcements/:id/views/count', viewController.getAnnouncementViewCount);

module.exports = router;