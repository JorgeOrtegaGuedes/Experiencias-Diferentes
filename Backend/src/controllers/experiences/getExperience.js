import 'dotenv/config.js';
import { getPool } from '../../db/poolQuery.js';
import { experienceNotExistError } from '../../services/errorService.js';

async function getExperience(req, res, next) {
    const { id } = req.query;

    try {
        if (!id) {
            experienceNotExistError();
        }

        const pool = await getPool();

        const [data] = await pool.query(
            `
        SELECT id, title, description, type, city, image, date, price, min_places, total_places, active FROM Experiences WHERE id = ?
        `,
            [id],
        );

        const [rate] = await pool.query(
            `
        SELECT AVG(rate) AS average_rate
        FROM Comments
        WHERE experience_id = ?
        `,
            [id],
        );

        const [inscribed] = await pool.query(
            `
            SELECT Users.id, Reservations.id as reservation_id, name, email, avatar FROM Users   
            INNER JOIN Reservations ON Users.id = Reservations.user_id WHERE Reservations.experience_id = ?
        `,
            [id],
        );

        const [comments] = await pool.query(
            `
            SELECT Comments.id, Comments.content, Users.name AS commenter_name
            FROM Comments
            INNER JOIN Users ON Comments.user_id = Users.id
            WHERE Comments.experience_id = ?
        `,
            [id],
        );

        const fullExperience = {
            data,
            comments,
            rate,
            inscribed,
        };

        res.json(fullExperience);
    } catch (error) {
        next(error);
    }
}

export { getExperience };
