import promisePool from '../../utils/database.js';

const listAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT c.cat_id, c.cat_name, c.weight, c.owner, c.filename,
           c.birthdate, u.name AS owner_name
    FROM wsk_cats c
    JOIN wsk_users u ON c.owner = u.user_id
    ORDER BY c.cat_id
  `);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT c.cat_id, c.cat_name, c.weight, c.owner, c.filename,
            c.birthdate, u.name AS owner_name
     FROM wsk_cats c
     JOIN wsk_users u ON c.owner = u.user_id
     WHERE c.cat_id = ?`,
    [id]
  );

  return rows.length === 0 ? false : rows[0];
};

const findCatsByOwner = async (ownerId) => {
  const [rows] = await promisePool.execute(
    `SELECT c.cat_id, c.cat_name, c.weight, c.owner, c.filename,
            c.birthdate, u.name AS owner_name
     FROM wsk_cats c
     JOIN wsk_users u ON c.owner = u.user_id
     WHERE c.owner = ?
     ORDER BY c.cat_id`,
    [ownerId]
  );
  return rows;
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const [rows] = await promisePool.execute(
    `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
     VALUES (?, ?, ?, ?, ?)`,
    [cat_name, weight, owner, filename, birthdate]
  );

  if (rows.affectedRows === 0) {
    return false;
  }

  return {cat_id: rows.insertId};
};

const modifyCat = async (cat, id) => {
  const allowedFields = [
    'cat_name',
    'weight',
    'owner',
    'filename',
    'birthdate',
  ];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (cat[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(cat[field]);
    }
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);
  const [rows] = await promisePool.execute(
    `UPDATE wsk_cats SET ${fields.join(', ')} WHERE cat_id = ?`,
    values
  );

  return rows.affectedRows === 0 ? false : {message: 'success'};
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ?',
    [id]
  );

  return rows.affectedRows === 0 ? false : {message: 'success'};
};

export {
  listAllCats,
  findCatById,
  findCatsByOwner,
  addCat,
  modifyCat,
  removeCat,
};
