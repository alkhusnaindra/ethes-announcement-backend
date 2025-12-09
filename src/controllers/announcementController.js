const prisma = require("./../config/prisma");
const removeCloudinary  = require("../utils/removeCloudinary");
const { search } = require("../app");

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany();
    res.status(200).json({
      message: "Announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json({
      message: "Announcement retrieved successfully",
      data: announcement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, linkUrl, status } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        content,
        type,
        fileUrl,
        linkUrl,
        status,
      },
    });
    res.status(201).json({
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, linkUrl, status } = req.body;

    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

   // pakai file lama jika tidak upload
    const fileUrl = req.file ? req.file.path : announcement.fileUrl;

    // jika upload file baru, hapus yang lama
    if (req.file && announcement.fileUrl && announcement.fileUrl !== fileUrl) {
      await removeCloudinary(announcement.fileUrl);
    }

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        type,
        fileUrl,
        linkUrl,
        status,
      },
    });

    res.status(200).json({
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if(!id) {
      res.status(400).json({ error: "ID parameter is required" });
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    if (announcement.fileUrl) {
      const isDeleted = await removeCloudinary(announcement.fileUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting image from Cloudinary" });
      }
    }

    const deletedAnnouncement = await prisma.announcement.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "Announcement deleted successfully",
      data: deletedAnnouncement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchAnnouncements = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({
      message: "Search completed successfully",
      data: announcements,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  searchAnnouncements,
};
