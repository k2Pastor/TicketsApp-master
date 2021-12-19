import express, {Request, Response} from "express";
import crypto from "crypto";
const multer  = require("multer");
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (_req: Request, _file: File, cb: Function) {
        cb(null, 'uploads/')
    },
    filename: function (_req: Request, file: any, cb: Function) {
        const salt = crypto.randomBytes(16).toString('hex');
        cb(null, salt + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({ storage: storage });

router.post("/img", upload.single('file'), function (req: any, res: Response) {
    let fileData = req.file;
    console.log(fileData);
    if(!fileData)
        res.send("Error while loading file!");
    else
        res.status(200).send({
            fileName: fileData.filename,
        });
});

module.exports = router;
