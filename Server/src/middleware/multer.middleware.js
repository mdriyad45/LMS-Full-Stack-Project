import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "upload/")
    },
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype.startWith("video/")){
        cb(null, true);
    }else{
         cb(new Error("Only video files are allowed!"), false)
    }
}

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, 
  },
})