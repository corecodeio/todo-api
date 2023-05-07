import { Router } from 'express';
import { run, get } from '../services/database.mjs';
import { postValidator, patchValidator } from '../middlewares/validator.mjs';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const toDos = await get('SELECT * FROM todos', [], true);
    const data = toDos.map((toDo) => ({
      id: toDo.id,
      title: toDo.title,
      description: toDo.description,
      isDone: Boolean(toDo.is_done),
    }));
    res.json({ message: 'To-dos retrieved successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while fetching the to-dos',
      error,
    });
  }
});

router.post('/', postValidator, async (req, res) => {
  try {
    const { title, description } = req.body;
    const data = await run(
      'INSERT INTO todos (title, description) VALUES (?,?)',
      [title, description]
    );
    res.json({
      message: 'To-do created successfully',
      toDo: {
        id: data.lastID,
        title,
        description,
        isDone: false,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while creating the new to-do',
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const toDo = await get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!Array.isArray(toDo) || toDo.length === 0) {
      return res.status(404).json({ message: 'To-do not found' });
    }
    await run('DELETE FROM todos WHERE id = ?', [id]);
    const { title, description, is_done: isDone } = toDo[0];
    res.json({
      message: 'To-do deleted successfully',
      toDo: {
        id: Number(id),
        title,
        description,
        isDone: Boolean(isDone),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while deleting the to-do',
      error,
    });
  }
});

router.patch('/:id', patchValidator, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const toDo = await get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!Array.isArray(toDo) || toDo.length === 0) {
      return res.status(404).json({ message: 'To-do not found' });
    }
    const { title, description, isDone: is_done } = req.body;
    const updatedFields = Object.entries({
      title,
      description,
      is_done,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc.push(`${key} = ?`);
      }
      return acc;
    }, []);
    await run(
      `UPDATE todos SET ${updatedFields} WHERE id = ?`,
      Object.values({ title, description, is_done })
        .filter((value) => value !== undefined)
        .concat(id)
    );
    res.json({
      message: 'To-do updated successfully',
      toDo: {
        id: Number(id),
        title: title || toDo[0].title,
        description: description || toDo[0].description,
        isDone: Boolean(is_done),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while updating the to-do',
      error,
    });
  }
});

export default router;
