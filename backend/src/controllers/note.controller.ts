import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, Note } from '../types';

export const getNotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { search, page = 1, limit = 50 } = req.query;

    let query = 'SELECT * FROM notes WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY updated_at DESC';

    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const result = await pool.query<Note>(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM notes WHERE user_id = $1';
    const countParams: any[] = [userId];

    if (search) {
      countQuery += ` AND (title ILIKE $2 OR content ILIKE $2)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notes',
    });
  }
};

export const getNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query<Note>(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get note',
    });
  }
};

export const createNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, content } = req.body;

    const result = await pool.query<Note>(
      `INSERT INTO notes (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, title, content]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Note created successfully',
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create note',
    });
  }
};

export const updateNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, content } = req.body;

    const result = await pool.query<Note>(
      `UPDATE notes
       SET title = COALESCE($1, title),
           content = COALESCE($2, content)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, content, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
    });
  }
};

export const deleteNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Note not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
    });
  }
};