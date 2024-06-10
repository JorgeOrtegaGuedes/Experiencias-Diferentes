import express from 'express';

import { addNewExperience } from '../controllers/experiences/addNewExperience.js';
import { changeExperienceStatus } from '../controllers/experiences/changeExperienceStatus.js';
import { experienceReservation } from '../controllers/experiences/experienceReservation.js';
import { listExperiences } from '../controllers/experiences/listExperiences.js';
import { experienceRating } from '../controllers/experiences/experienceRating.js';
import { getExperience } from '../controllers/experiences/getExperience.js';
import { userAuth } from '../middlewares/userAuth.js';
import { addNewComment } from '../controllers/experiences/addNewComment.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { editExperience } from '../controllers/experiences/editExperience.js';
import { getMyExperiences } from '../controllers/experiences/getMyExperiences.js';
import { deleteCommentFromExperience } from '../controllers/experiences/deleteCommentFromExperience.js';
import { deleteUserFromReservation } from '../controllers/experiences/deleteUserFromReservation.js';
import { getComments } from '../controllers/experiences/getComments.js';

const experiencesRouter = express.Router();

experiencesRouter.patch('/edit/', userAuth, adminMiddleware, editExperience);

experiencesRouter.get('/detail/', getExperience);
experiencesRouter.get('/myexperiences/', userAuth, getMyExperiences);
experiencesRouter.get('/myexperiences/comments', getComments);
experiencesRouter.get('/', listExperiences);
experiencesRouter.post(
    '/newexperience',
    userAuth,
    adminMiddleware,
    addNewExperience,
);
experiencesRouter.post('/', userAuth, addNewComment);
experiencesRouter.patch('/', userAuth, changeExperienceStatus);
experiencesRouter.post('/reservation', userAuth, experienceReservation);
experiencesRouter.post('/rate', userAuth, experienceRating);
experiencesRouter.delete(
    '/comments/',
    userAuth,
    adminMiddleware,
    deleteCommentFromExperience,
);
experiencesRouter.delete(
    '/reservation',
    userAuth,
    adminMiddleware,
    deleteUserFromReservation,
);

export { experiencesRouter };
