import {Router} from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js';
import * as mainFunction from '../controllers/appFunction.js';
import { OTPMail, registerMail } from '../controllers/mailer.js';
import auth, { localVariable } from '../middleware/auth.js';


/** POST Methods */
router.route('/register').post(controller.register); //register user
router.route('/registerMail').post(registerMail); // send the register email
router.route('/OTPMail').post(OTPMail); // send the OTP email
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // autheticate user
router.route('/login').post(controller.verifyUser, controller.login); // login app

/** GET Methods */
router.route('/user/:username').get(controller.getUser); // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariable, controller.generateOTP); // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // reset all the variables
router.route('/getuser').get(auth, mainFunction.getUserDetail); 
router.route('/getExpenses').get(auth, mainFunction.getExpenses); 
router.route('/getShareExpensesInfo').get(auth, mainFunction.getShareExpensesInfo);
router.route('/getChartData').get(auth, mainFunction.getChartData)

/** PUT Methods */
router.route('/updateuser').put(auth, controller.updateUser); // is use to update the user profile
router.route('/addMember').put(auth, mainFunction.addMember);
router.route('/deleteMember').put(auth, mainFunction.deleteMember);
router.route('/editMember').put(auth, mainFunction.editMember);
router.route('/addExpense').put(auth, mainFunction.addExpense);
router.route('/deleteExpense').put(auth, mainFunction.deleteExpense);
router.route('/editExpense').put(auth, mainFunction.editExpense);
router.route('/sharedExpenses').put(auth, mainFunction.sharedExpenses);
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password


export default router;