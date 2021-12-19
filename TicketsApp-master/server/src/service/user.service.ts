import {DetailedUserRepository} from "../repository/detailed-user.repository";
import {CredentialsModel, DetailedUserModel, SecureUserModel} from "@pavo/shared-services-shared/src";
import {SecureUserRepository} from "../repository/secure-user.repository";

export interface IUserService {
    getUser: (id: string) => Promise<DetailedUserModel>;
    getAll: () => Promise<DetailedUserModel[]>;
    createUser: (registrationModel: RegistrationModel) => Promise<CredentialsModel>;
}

export interface RegistrationModel extends DetailedUserModel {
    password: string;
}

export class UserService implements IUserService {
    getUser(id: string): Promise<DetailedUserModel> {
        return DetailedUserRepository.findById(id).exec();
    }

    getAll(): Promise<DetailedUserModel[]> {
        return SecureUserRepository.find({}).exec();
    }

   createUser(registrationModel: RegistrationModel): Promise<CredentialsModel> {
        if (!registrationModel.email) {
            return Promise.reject("email is required");
        }

        if (!registrationModel.password) {
            return Promise.reject("password is required");
        }

        const finalUser = new SecureUserRepository(registrationModel);
        finalUser.setPassword(registrationModel.password);

        registrationModel.token = "STDAFX.H";
        if (!registrationModel.role) {
            registrationModel.role = "User";
        }

        return finalUser.save()
            .then((secureUser: SecureUserModel) => {
                const user = new DetailedUserRepository(registrationModel);
                return user.save()
                    .then((userDetails: DetailedUserModel) => {
                        const credentials = {
                            firstName : userDetails.firstName,
                            token : "Token=" + secureUser.generateJWT(),
                            role: userDetails.role,
                            _id : userDetails._id
                        }
                        return Promise.resolve(credentials);
                    });
            });
    }
}
