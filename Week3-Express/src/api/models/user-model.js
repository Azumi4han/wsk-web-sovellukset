import promisePool from '../../utils/database.js';

const userFields = 'user_id, name, username, email, role';

const listAllUsers = async () => {
  const [rows] = await promisePool.query(
    `SELECT ${userFields} FROM wsk_users ORDER BY user_id`
  );
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT ${userFields} FROM wsk_users WHERE user_id = ?`,
    [id]
  );
  return rows.length === 0 ? false : rows[0];
};

const findUserByUsername = async (username) => {
  const [rows] = await promisePool.execute(
    `SELECT user_id, name, username, email, password, role
     FROM wsk_users WHERE username = ?`,
    [username]
  );
  return rows.length === 0 ? false : rows[0];
};

const addUser = async (user) => {
  const {name, username, email, password, role = 'user'} = user;
  const [rows] = await promisePool.execute(
    `INSERT INTO wsk_users (name, username, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, username, email, password, role]
  );

  if (rows.affectedRows === 0) {
    return false;
  }

  return {user_id: rows.insertId};
};

const modifyUser = async (user, id) => {
  const allowedFields = ['name', 'username', 'email', 'password', 'role'];
  const fields = [];
  const values = [];

  for (const field of allowedFields) {
    if (user[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(user[field]);
    }
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);
  const [rows] = await promisePool.execute(
    `UPDATE wsk_users SET ${fields.join(', ')} WHERE user_id = ?`,
    values
  );

  return rows.affectedRows === 0 ? false : {message: 'success'};
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();
    const [cats] = await connection.execute(
      'DELETE FROM wsk_cats WHERE owner = ?',
      [id]
    );
    const [users] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id]
    );

    if (users.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return {message: 'success', deletedCats: cats.affectedRows};
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  modifyUser,
  removeUser,
};
