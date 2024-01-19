import express, { Router } from 'express';
import { registerController, loginController, verifyEmailController, listDataController, verifyDataController, updateDataController, deleteDataController, verifyOTPController } from './../controller/authController';
import { authenticateToken } from '../middleware/authMiddleware';

// router object
const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *     user:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     userData:
 *        type: object
 *        properties:
 *          name:
 *              type: string 
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          phone:
 *              type: string
 *          address:
 *              type: string
 *          gender:
 *              type: string
 *          hobbies:
 *              type: any
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       name: Authorization
 *       scheme: bearer
 */



// routing
// register || Method POST
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Used to Register
 *     description: Used to Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userData'           
 *     responses:
 *       '200':
 *         description: Registered successfully
 */
router.post('/register', registerController);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Used to login
 *     description: Used to login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'           
 *     responses:
 *       '200':
 *         description: Login successfully
 */
router.post('/login', loginController); // LOGIN || POST

/**
 * @swagger
 * /users:
 *   get:
 *     summary: To get all users from MongoDB
 *     description: This API is used to fetch data from MongoDB
 *     responses:
 *       '200':
 *         description: This API is used to fetch data from MongoDB
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/users'
 */
router.get('/users', listDataController); // list of all users || GET

/**
 * @swagger
 * /update-user/{id}:
 *   put:
 *     summary: Used to update data in MongoDB
 *     description: Used to update data in MongoDB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID required
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userData' 
 *     security:
 *       - BearerAuth: []         
 *     responses:
 *       '200':
 *         description: User Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 */
router.put('/update-user/:id', authenticateToken, updateDataController); // update data || PUT

/**
 * @swagger
 * /delete-user/{id}:
 *   delete:
 *     summary: Used to delete data in MongoDB
 *     description: Used to delete data in MongoDB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID required
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token for authentication
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []         
 *     responses:
 *       '200':
 *         description: User Deleted successfully
 */
router.delete('/delete-user/:id', authenticateToken, deleteDataController); // delete data || delete

/**
 * @swagger
 * /sendotp:
 *   get:
 *     summary: Used to Send OTP and Verification mail to user's mail and phone number
 *     description: Used to Send OTP and Verification mail to user's mail and phone number
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token for authentication
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []         
 *     responses:
 *       '200':
 *         description: Verification mail and OTP sent successfully
 */
router.get('/sendotp', authenticateToken, verifyDataController); // send otp

/**
 * @swagger
 * /verifyotp/{otp}:
 *   get:
 *     summary: Used to Verify OTP sent to Phone number
 *     description: Used to delete data in MongoDB
 *     parameters:
 *       - in: path
 *         name: otp
 *         required: true
 *         description: Hashed OTP required
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token for authentication
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []         
 *     responses:
 *       '200':
 *         description: User Deleted successfully
 */
router.get('/verifyotp/:otp', authenticateToken, verifyOTPController); // verify otp

/**
 * @swagger
 * /verifyemail/{token}:
 *   get:
 *     summary: Used to verify user's mail.
 *     description: Used to verify user's mail.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: token required
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token for authentication
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []         
 *     responses:
 *       '200':
 *         description: User Deleted successfully
 */
router.get('/verifyemail/:token', authenticateToken, verifyEmailController); // verify otp,
// for more authetication we can add middleware and pass token

export default router;
