import type { ITask, Q } from '@/types';
import { $api } from '@/api';

export default class TaskService {
  static getTasks({ page, limit, sort, descending, filter }: Q.PaginationRequest) {
    return $api.get('tasks', { searchParams: { page, limit, sort, descending, filter } });
  }

  static update(taskId: string, data: { status?: ITask['status']; userId?: string }) {
    return $api.patch(`tasks/${taskId}`, { json: data }).json<null>();
  }

  static create(task: { title: string; tags: string[]; subtasks: { title: string; description: string }[] }) {
    return $api.post('tasks', { json: task }).json();
  }

  static show(taskId: string) {
    return $api.get(`tasks/${taskId}`).json<ITask>();
  }

  static createTaskCsv(taskId: string) {
    return $api.get(`tasks/report/${taskId}`).blob();
  }

  static updateSubtask(subtaskId: string, data: { status?: string; cause?: string }) {
    return $api.patch(`tasks/subtasks/${subtaskId}`, { json: data }).json<null>();
  }

  static deleteSubtask(subtaskId: string, taskId: string) {
    return $api.delete(`tasks/subtasks/${subtaskId}`, { searchParams: { taskId } }).json<null>();
  }

  static moveSubtask(subtaskId: string, taskId: string, newTaskId: string) {
    return $api.patch(`tasks/subtasks/move/${subtaskId}`, { json: { taskId, newTaskId } }).json<null>();
  }
}
