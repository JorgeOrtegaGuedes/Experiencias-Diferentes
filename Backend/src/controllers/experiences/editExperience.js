import { getPool } from '../../db/poolQuery.js';
import { changeExperienceStatusSchema } from '../../schemas/experiences/changeExperienceStatusSchema.js';
import { editExperienceSchema } from '../../schemas/experiences/editExperienceSchema.js';
import { imageNeeded } from '../../services/errorService.js';
import validateSchema from '../../utilities/validateSchema.js';
import {
    deleteImageFromCloudinary,
    savePhotoExpToCloudinary,
} from '../../utilities/cloudinaryImages.js';
import 'dotenv/config.js';
const { DEFAULT_RELAJADO_URL, DEFAULT_MEDIO_URL, DEFAULT_ADRENALINA_URL } =
    process.env;

async function editExperience(req, res, next) {
    const { id } = req.query;

    const newExperience = req.body;

    const {
        title,
        description,
        type,
        city,
        date,
        price,
        min_places,
        total_places,
        is_active,
    } = newExperience;

    try {
        await validateSchema(editExperienceSchema, req.body);

        const pool = await getPool();

        if (req.files?.newImage) {
            // Primero eliminamos la imagen anterior si la hay
            const [image] = await pool.query(
                `SELECT image FROM Experiences WHERE id = ?;`,
                [id],
            );

            const oldImage = image[0].image;

            if (!req.files.newImage && !oldImage) {
                imageNeeded();
            }

            if (
                oldImage !==
                (DEFAULT_RELAJADO_URL ||
                    DEFAULT_MEDIO_URL ||
                    DEFAULT_ADRENALINA_URL)
            ) {
                await deleteImageFromCloudinary(oldImage);
            }

            // Luego guardamos la nueva
            const secure_url = await savePhotoExpToCloudinary(
                req.files.newImage.tempFilePath,
            );

            await pool.query(
                `
                UPDATE Experiences
                SET 
                title = ?,
                description = ?,
                type = ?,
                city = ?,
                image = ?,
                date = ?,
                price = ?,
                min_places = ?,
                total_places = ?,
                active = ?
                WHERE
                id = ?;
            `,
                [
                    title,
                    description,
                    type,
                    city,
                    secure_url,
                    date,
                    price,
                    min_places,
                    total_places,
                    is_active,
                    id,
                ],
            );

            res.status(200).send({ message: 'Experiencia actualizada' });
        } else {
            const [image] = await pool.query(
                `SELECT image FROM Experiences WHERE id = ?;`,
                [id],
            );

            const oldImage = image[0].image;
            await pool.query(
                `
                UPDATE Experiences
                SET 
                title = ?,
                description = ?,
                type = ?,
                city = ?,
                image = ?,
                date = ?,
                price = ?,
                min_places = ?,
                total_places = ?,
                active = ?
                WHERE
                id = ?;
            `,
                [
                    title,
                    description,
                    type,
                    city,
                    oldImage,
                    date,
                    price,
                    min_places,
                    total_places,
                    is_active,
                    id,
                ],
            );

            res.status(200).send({ message: 'Experiencia actualizada' });
        }
    } catch (error) {
        next(error);
    }
}

export { editExperience };
