import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest, Event } from '../types';

export const getEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { start_date, end_date } = req.query;

    let query = 'SELECT * FROM events WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (start_date) {
      query += ` AND end_date >= $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      query += ` AND start_date <= $${paramIndex}`;
      params.push(end_date);
      paramIndex++;
    }

    query += ' ORDER BY start_date ASC';

    const result = await pool.query<Event>(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get events',
    });
  }
};

export const getEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query<Event>(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get event',
    });
  }
};

export const createEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { title, description, start_date, end_date, all_day, color } = req.body;

    const result = await pool.query<Event>(
      `INSERT INTO events (user_id, title, description, start_date, end_date, all_day, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, title, description, start_date, end_date, all_day || false, color]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Event created successfully',
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
    });
  }
};

export const updateEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { title, description, start_date, end_date, all_day, color } = req.body;

    const result = await pool.query<Event>(
      `UPDATE events
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           all_day = COALESCE($5, all_day),
           color = COALESCE($6, color)
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [title, description, start_date, end_date, all_day, color, id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
    });
  }
};

export const deleteEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Event not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
    });
  }
};