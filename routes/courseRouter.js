const router = require("express").Router();
const upload = require("./../awsConfig/multerSetup"); // Multer setup for file uploads

//requiring all controller functions:
const {
    editFolder,
    uploadChapter,
    createNewCourse,
} = require("../controllers/createCourseController");
const { deleteEntireFolder } = require("../controllers/deleteCourseController");
const {
    getAllCourses,
    getCourseMetaData,
    getFile,
} = require("../controllers/getCourseController");
const {
    protectStudent,
    protectTeacher,
} = require("../controllers/userAuthController");

// Routes for creating courses :
router.route("/editFolder").post(protectTeacher, editFolder);
router
    .route("/uploadFolder")
    .post(protectTeacher, upload.array("binary", 15), uploadChapter);
router
    .route("/createCourse")
    .post(protectTeacher, upload.single("binary"), createNewCourse);

// Routes for getting courses
// router.route("/getFile").post(protect, getFile);
router.route("/getAllCourses").get(protectTeacher, getAllCourses);
router.route("/getCourseMetaData").post(protectTeacher, getCourseMetaData);

// Routes for deleting courses
const deleteCourseDB = require("./../utils/deleteCourseDB");
const { deleteAllBucketAtOnce } = require("./../awsConfig/bucketControl");
router.route("/deleteFolder").post(deleteEntireFolder);
router.route("/deleteCourseDB").get(deleteCourseDB);
router.route("/deleteCourseAWS").get(deleteAllBucketAtOnce);

module.exports = router;
