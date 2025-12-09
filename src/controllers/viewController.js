const prisma = require("./../config/prisma");
const removeCloudinary = require("../utils/removeCloudinary");

// Insert view ketika announcement dibuka
const addAnnouncementView = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ error: "employeeId is required" });
    }

    // Pastikan announcement ada
    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Upsert agar tidak duplicate
    await prisma.announcementView.upsert({
      where: {
        announcementId_employeeId: {
          announcementId: parseInt(id),
          employeeId,
        },
      },
      update: {},
      create: {
        announcementId: parseInt(id),
        employeeId,
      },
    });

    res.status(201).json({
      message: "View recorded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get list view by announcement
const getAnnouncementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const views = await prisma.announcementView.findMany({
      where: { announcementId: parseInt(id) },
      include: {
        employee: true, // return details employee
      },
      orderBy: { viewedAt: "desc" },
    });

    res.status(200).json({
      message: "Views retrieved successfully",
      data: views,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Count views
const getAnnouncementViewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const count = await prisma.announcementView.count({
      where: { announcementId: parseInt(id) },
    });

    res.status(200).json({
      message: "View count retrieved successfully",
      totalViews: count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addAnnouncementView,
  getAnnouncementViews,
  getAnnouncementViewCount,
};
