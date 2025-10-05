import { Request } from 'express';

// User types
export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Task types
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  due_date?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

// Event types
export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  all_day: boolean;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

// Note types
export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

// Notification types
export enum NotificationType {
  TASK_DUE_SOON = 'task_due_soon',
  TASK_OVERDUE = 'task_overdue',
  EVENT_REMINDER = 'event_reminder',
}

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  related_id?: number;
  is_read: boolean;
  created_at: Date;
}

// Auth types
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TokenPayload {
  id: number;
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}