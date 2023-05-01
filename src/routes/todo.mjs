import { Router } from 'express';
import { run, get } from '../services/database.mjs';
import validator from '../middlewares/validator.mjs';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const toDos = await get('SELECT * FROM todos', [], true);
    const data = toDos.map((toDo) => ({
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

router.post('/', validator, async (req, res) => {
  try {
    const { title, description } = req.body;
    await run('INSERT INTO todos (title, description) VALUES (?,?)', [
      title,
      description,
    ]);
    res.json({ message: 'To-do created successfully' });
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
    const toDo = await get('SELECT id FROM todos WHERE id = ?', [id]);
    if (!Array.isArray(toDo) || toDo.length === 0) {
      return res.status(404).json({ message: 'To-do not found' });
    }
    await run('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ message: 'To-do deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while deleting the to-do',
      error,
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const toDo = await get('SELECT id FROM todos WHERE id = ?', [id]);
    if (!Array.isArray(toDo) || toDo.length === 0) {
      return res.status(404).json({ message: 'To-do not found' });
    }
    const { title, description, isDone: is_done } = req.body;
    if (typeof is_done !== 'boolean') {
      return res.status(400).json({ message: 'isDone expected to be boolean' });
    }
    await run(
      'UPDATE todos SET title = ?, description = ?, is_done = ? WHERE id = ?',
      [title, description, Number(is_done), id]
    );
    res.json({ message: 'To-do updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while updating the to-do',
      error,
    });
  }
});

export default router;
