import {CredentialsModel, RegistrationPageModel, UserRole} from "@pavo/shared-services-shared/src";
import {api_url} from "../environment";

export const userService = {
    login,
    logout,
    getAll,
    hasRole,
    isAuthenticated,
    getCredentials,
    register,
};

function getCredentials(): CredentialsModel {
    // return {firstName: "", id: "", role: "", token: ""};
    const credentials = localStorage.getItem('credentials');
    if (credentials) {
        return JSON.parse(credentials);
    }
    return null;
}

function isAuthenticated() {
    return !!localStorage.getItem('credentials');
}

function hasRole(role: UserRole) {
    return isAuthenticated() && getCredentials()?.role === role;
}

function register(model: RegistrationPageModel): Promise<CredentialsModel> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model)
    };

    return fetch(`${api_url}/api/user/createUser`, requestOptions)
        .then(handleResponse)
        .then(credentials => {
            // login successful if there's a user in the response
            if (credentials) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                localStorage.setItem('credentials', JSON.stringify(credentials));
            }
            return credentials;
        });
}

function login(userEmail: string, userPassword: string): Promise<CredentialsModel> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email : userEmail,
            password : userPassword
        })
    };

    return fetch(`${api_url}/api/login`, requestOptions)
        .then(handleResponse)
        .then(credentials => {
            // login successful if there's a user in the response
            if (credentials) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                localStorage.setItem('credentials', JSON.stringify(credentials));
            }
            return credentials;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('credentials');
}

function getAll() {

    //return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response: Response): Promise<CredentialsModel> {
    return response.text().then((text: string) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                //location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
