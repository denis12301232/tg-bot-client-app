import type { ITask, PaginationRequest } from '@/types';
import { $api } from '@/api';

export default class TaskService {
  static getTasks({ page, limit, sort, descending, filter }: PaginationRequest) {
    return $api.get('tasks', { searchParams: { page, limit, sort, descending, filter } });
  }

  static updateTaskStatus(task_id: string, status: ITask['status']) {
    return $api.patch('tasks/update_task_status', { json: { task_id, status } });
  }

  static setUserForTask(task_id: string) {
    return $api.patch('tasks/set_user_for_task', { json: { task_id } });
  }

  static createTask(task: { title: string; tags: string[]; subtasks: { title: string; description: string }[] }) {
    return $api.post('tasks', { json: task });
  }

  static getTaskById(taskId: string) {
    return $api.get('tasks/get_task_by_id', { searchParams: { task_id: taskId } });
  }

  static updateSubtask(data: { subtask_id: string; status?: string; cause?: string }) {
    return $api.patch('tasks/update_subtask', { json: data });
  }

  static createTaskCsv(taskId: string) {
    return $api.get('tasks/create_task_csv', { searchParams: { task_id: taskId } });
  }

  static deleteSubtask(subtask_id: string, task_id: string) {
    return $api.delete('tasks/delete_subtask', { searchParams: { subtask_id, task_id } });
  }

  static moveSubtask(subtask_id: string, task_id: string, new_task_id: string) {
    return $api.patch('tasks/move_subtask', { json: { subtask_id, task_id, new_task_id } });
  }
}
