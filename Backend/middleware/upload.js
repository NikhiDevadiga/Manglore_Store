import multer from "multer"; // Middleware for handling form-data, mainly for file uploads.
import path from "path";     // To work with file and directory paths.
import fs from "fs";         // To interact with the file system.

// Define the base image directory using path.join for cross-platform compatibility
const baseImagePath = path.join("Backend", "Images");

// Ensure the base folder exists, including any missing parent folders
if (!fs.existsSync(baseImagePath)) {
  fs.mkdirSync(baseImagePath, { recursive: true });
}

// Helper function to ensure a given folder exists
const ensureDir = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "Others";

    // Assign folder based on the request URL
    if (req.originalUrl.includes("subcategory")) {
      folder = "Subcategory";
    } else if (req.originalUrl.includes("category")) {
      folder = "Category";
    } else if (req.originalUrl.includes("Product")) {
      folder = "Product";
    }

    // Build the full path and ensure it exists
    const fullPath = path.join(baseImagePath, folder);
    ensureDir(fullPath);
    
    cb(null, fullPath);
  },

  filename: function (req, file, cb) {
    // Append the current timestamp to the original filename
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Only allow PNG and JPEG files
    const validTypes = ["image/png", "image/jpeg"];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png and .jpg (jpeg) files are allowed"));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit files to 5MB
  }
});

export default upload;