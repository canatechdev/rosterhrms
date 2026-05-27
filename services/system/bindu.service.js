const pool = require('../../config/database');

const parsePointNo = (point_no) => {
    if (point_no === undefined || point_no === null) {
        throw { status: 400, message: 'Point number is required' };
    }
    const parsed = Number(point_no);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 200) {
        throw { status: 400, message: 'Point number must be an integer between 1 and 200' };
    }
    return parsed;
};

const parseOptionalId = (value, fieldName) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw { status: 400, message: `${fieldName} must be a positive integer or null` };
    }
    return parsed;
};

const createBinduPoint = async ({ point_no, caste_id }) => {
    const parsedPoint = parsePointNo(point_no);
    const parsedCasteId = parseOptionalId(caste_id, 'Caste ID');

    const result = await pool.query(
        `INSERT INTO bindu_points (point_no, caste_id)
         VALUES ($1, $2)
         ON CONFLICT (point_no) DO UPDATE SET
            caste_id = EXCLUDED.caste_id,
            status = 1,
            updated_at = NOW()
         RETURNING bindu_id, point_no, caste_id, status, created_at, updated_at`,
        [parsedPoint, parsedCasteId]
    );

    return result.rows[0];
};

const getBinduPoints = async () => {
    const result = await pool.query(
        `SELECT bp.bindu_id,
                bp.point_no,
                bp.caste_id,
                bp.status,
                bp.created_at,
                bp.updated_at,
                c.name AS caste_name,
                c.name_mr AS caste_name_mr,
                c.code AS caste_code,
                c.priority AS caste_priority
         FROM bindu_points bp
         LEFT JOIN castes c ON bp.caste_id = c.caste_id
         WHERE bp.status = 1
         ORDER BY bp.point_no ASC`
    );

    return result.rows;
};

const getBinduPointById = async (id) => {
    if (!id) throw { status: 400, message: 'Bindu point ID is required' };
    const result = await pool.query(
        `SELECT bp.bindu_id,
                bp.point_no,
                bp.caste_id,
                bp.status,
                bp.created_at,
                bp.updated_at,
                c.name AS caste_name,
                c.name_mr AS caste_name_mr,
                c.code AS caste_code,
                c.priority AS caste_priority
         FROM bindu_points bp
         LEFT JOIN castes c ON bp.caste_id = c.caste_id
         WHERE bp.bindu_id = $1 AND bp.status = 1`,
        [id]
    );

    return result.rows[0];
};

const updateBinduPoint = async (payload) => {
    const { id, point_no, caste_id } = payload;
    if (!id) throw { status: 400, message: 'Bindu point ID is required' };
    const parsedPoint = parsePointNo(point_no);

    const hasCasteId = Object.prototype.hasOwnProperty.call(payload, 'caste_id');
    if (!hasCasteId) {
        throw { status: 400, message: 'Caste ID is required (use null to unassign)' };
    }

    const parsedCasteId = parseOptionalId(caste_id, 'Caste ID');

    const result = await pool.query(
        `UPDATE bindu_points
         SET point_no = $1,
             caste_id = $2,
             updated_at = NOW()
         WHERE bindu_id = $3 AND status = 1
         RETURNING bindu_id, point_no, caste_id, status, created_at, updated_at`,
        [parsedPoint, parsedCasteId, id]
    );

    return result.rows[0];
};

const deleteBinduPoint = async (id) => {
    if (!id) throw { status: 400, message: 'Bindu point ID is required' };
    const result = await pool.query(
        `DELETE FROM bindu_points
          WHERE bindu_id = $1 AND status = 1
         RETURNING bindu_id`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createBinduPoint,
    getBinduPoints,
    getBinduPointById,
    updateBinduPoint,
    deleteBinduPoint,
};
