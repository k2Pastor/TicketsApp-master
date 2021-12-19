import express, {Request, Response} from "express";
import {IUserService, RegistrationModel, UserService} from "../../service/user.service";
import {auth} from "../../auth/auth";

const userService: IUserService = new UserService();
const router = express.Router();

export class UserController {
    getUser(req: Request, res: Response) {
        const id = req.body.id;
        userService.getUser(id).then((user) => {
            res.send(user);
        });
    }

    getAllUsers(_req: Request, res: Response) {
        userService.getAll().then((values) => {
            res.send(values);
        });
    }

    createUser(req: Request, res: Response) {
        const body = req.body;
        const model: RegistrationModel = {
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            phone: body.phone,
        }
        userService.createUser(model).then((credentials) => {
            res.send(credentials);
        });
    }
}

const controller = new UserController();

router.post('/getUser', auth.required, controller.getUser)

router.get('/getAllUsers', auth.required, controller.getAllUsers)

router.post('/createUser', auth.optional, controller.createUser)

module.exports = router;
