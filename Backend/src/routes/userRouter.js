// Importamos las dependencias.
import express from 'express';

// Aquí se importan las funciones controladoras finales.

import { newUserController } from '../controllers/users/newUserController.js';

import { validateUserController } from '../controllers/users/validateUserController.js';

import loginUserController from '../controllers/users/loginUserController.js';

import { changeUserPasswordController } from '../controllers/users/changeUserPasswordController.js';

import sendRecoverPassController from '../controllers/users/sendRecoverPassController.js';

import resetPasswordController from '../controllers/users/resetPasswordController.js';
import { updateUserController } from '../controllers/users/updateUserController.js';
import { userAuth } from '../middlewares/userAuth.js';
import { userInscribed } from '../controllers/users/userInscribed.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { getUserByIdController } from '../controllers/users/getUserByIdController.js';
import { deleteUserAccount } from '../controllers/users/deleteUserAccount.js';
import { reactivateUserController } from '../controllers/users/reactivateUserController.js';

// Aquí se importan las funciones controladoras intermedias.

// Creamos un enrutador con express, que permite definir rutas y manejar
// solicitudes HTTP específicas para esas rutas.
const userRouter = express.Router();

// Crear un usuario pendiente de activar.
userRouter.post('/register', newUserController);

// Validar a un usuario.
userRouter.patch('/validate/:registrationCode', validateUserController);

//Obtener datos de un usuario
userRouter.get('/profile', userAuth, getUserByIdController);

userRouter.get('/userInscribed', userAuth, adminMiddleware, userInscribed);

// Middleware de login de usuario.
userRouter.post('/login', loginUserController);

// Cambio de contraseña
userRouter.put('/changePassword', userAuth, changeUserPasswordController);

// Enviar email de recuperación de contraseña.
userRouter.post('/password/forget', sendRecoverPassController);
userRouter.post('/password/recover', resetPasswordController);

userRouter.patch('/updateProfile', userAuth, updateUserController);

// Enviar email de reactivación de cuenta

userRouter.post('/reactivate', reactivateUserController);

//Borrado de cuenta

userRouter.patch('/deleteAccount', userAuth, deleteUserAccount);

export { userRouter };
