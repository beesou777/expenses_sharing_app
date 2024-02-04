import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import ENV from '../config.js';
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const {username} = req.method == "GET" ? req.query: req.body;

        // check the user existance
        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error: "Can't find User!"});
        next();
    }
    catch(error) {
        res.status(404).send({error: "Authentication Error!"});
    }
}

/** POST:  http://localhost:8080/api/register
    @param: {
        "username": "group123",
        "password": "abc123",
        "groupname": "Happy Group",
        "email": "group123@mail.com",
        "icon": ""
    }
*/
export async function register(req, res) {
    try {
        const {username, password, email, icon} = req.body;

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({username}, (err, user) => {
                if(err) reject({error: err.message});
                if(user) reject({ error: "Please use unique username"});
                resolve();
            });
        });

        // check for existing email - NOT NEEDED (ALLOW MULTI GROUPS FOR 1 EMAIL)
        // const existEmail = new Promise((resolve, reject) => {
        //     UserModel.fineOne({ email }, (err, user) => {
        //         if(err) reject(new Error(err));
        //         if(user) reject({ error: "Please use unique email"});
        //         resolve();
        //     })
        // });

        // Promise.all([existUsername, existEmail])
        existUsername
            .then(()=> {
                if(password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                email,
                                icon: icon || ""
                            })

                            // return save result as a response
                            user.save()
                                .then(result => {
                                    res.status(201).send({msg: 'User Registered Successfully!'});
                                })
                                .catch(error => {
                                    res.status(500).send({error: error.message});
                                })
                        })
                        .catch(error => {
                            return res.status(500).send({
                                error: "Unable to hash password"
                            })
                        });
                }
            })
            .catch(error => {
                return res.status(500).send({error: error.message});
            })

    }
    catch(error) {
        res.status(500).send({error: error.message});
    }
}

/** POST:  http://localhost:8080/api/login
    @param: {
        "username": "group123",
        "password": "abc123"
    }
*/
export async function login(req, res) {
    
    const {username, password} = req.body;

    try {
        UserModel.findOne({username})
        .then(user => {

            bcrypt.compare(password, user.password)
                .then(passwordMatch => {
                    if(!passwordMatch) {
                        return res.status(500).send({error: "Password does not match!"})
                    }

                    // create jwt token
                    jwt.sign({
                        userId: user._id,
                        username: user.username
                    }, process.env.JWT_SECRET, {expiresIn: '30d'}, (error, token) => {
                        if(error) {
                            return res.status(500).send({error: error.message});
                        }
                        else {
                            return res.status(200).send({
                                msg: "Login Successfully!",
                                usermame: user.username,
                                token
                            });
                        }
                    });
                } )
                .catch(error => {
                    return res.status(500).send({error: "Error when comparing password!"});
                })
        })
        .catch(error => {
            return res.status(500).send({error: "Username Not Found!"})
        })
    }
    catch (error) {
        res.status(500).send({error: error.message});
    }
}

/** GET:  http://localhost:8080/api/user/group123 */
export async function getUser(req, res) {
    const {username} = req.params;

    try {
        if(!username) return res.status(501).send({error: "Invalid Username"});

        UserModel.findOne({username}, (error, user)=> {
            if(error) return res.status(501).send({error: error.message});
            if(!user) return res.status(501).send({error: "Cannot Find the user"});

            // remove password from user
            // mongoose return unnessary data with object so we need convert it into json
            const {password, ...rest} = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        });

    }
    catch (error) {
        return res.status(404).send({error: "Cannot Find User Data"});
    }
}

/** PUT:  http://localhost:8080/api/updateuser 
    @param: {
        "id": "<userid>",
    }
    body: {
        "groupname": "",
        "icon": ""
    }
*/
export async function updateUser(req, res) {
    try {
        // const id = req.query.id;
        const { userId } = req.user; // from token (auth.js)

        if(userId) {
            const body = req.body;

            //update the data
            UserModel.updateOne({_id: userId}, body, {runValidators: true} ,(error, data) => {
                if(error) return res.status(401).send({error: error.message});
                return res.status(201).send({msg: "Record Updated!"});
            });
        }
        else {
            return res.status(401).send({error: "User Not Found!"})
        }
    }
    catch(error) {
        return res.status(401).send({error: error.message});
    }
}

/** GET:  http://localhost:8080/api/generateOTP?username=group123 */
export async function generateOTP(req, res) {
    req.app.locals.OTP =  await otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false});
    res.status(201).send({code: req.app.locals.OTP});
}

/** GET:  http://localhost:8080/api/verifyOTP?username=group123&code=661909 */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({msg: 'Verify Successfully!'});
    }
    return res.status(400).send({error: 'Invalid OTP'});
}

//Sucessfully redirect user when OTP is valid
/** GET:  http://localhost:8080/api/createResetSession*/
export async function createResetSession(req, res) {
    if(req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession});
    }
    else {
        res.status(440).send({error: 'Session Expired!'});
    }
}

//Update the password when we have valid session
/** PUT:  http://localhost:8080/api/resetPassword  */
export async function resetPassword(req, res) {
    try {
        if(!req.app.locals.resetSession) {
            return res.status(440).send({error: 'Session Expired!'});
        }
        const { username, password } = req.body;
        try {
            UserModel.findOne({username})
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({username: user.username}, {password: hashedPassword}, {runValidators: true}, (err, data) => {
                                if(err) return res.status(404).send({error: err.message});
                                req.app.locals.resetSession = false;
                                return res.status(201).send({ msg: "Password Updated!"});
                            });
                        })
                        .catch(error => {
                            return res.status(500).send({error: "Unable to hash password"});
                        });
                })
                .catch(error => {
                    return res.status(404).send({error: "Username not Found!"});
                });
        }
        catch (error) {
            return res.status(500).send({error: error.message});
        }
    }
    catch(error) {
        res.status(401).send({error: error.message});
    }
}
