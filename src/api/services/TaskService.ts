import type { ITask, Q } from '@/types';
import { $api } from '@/api';

export default class TaskService {
  static getTasks({ page, limit, sort, descending, filter }: Q.PaginationRequest) {
    return $api.get('tasks', { searchParams: { page, limit, sort, descending, filter } });
  }

  static updateTaskStatus(taskId: string, status: ITask['status']) {
    return $api.patch('tasks/update_task_status', { json: { taskId, status } });
  }

  static setUserForTask(taskId: string) {
    return $api.patch('tasks/set_user_for_task', { json: { taskId } });
  }

  static createTask(task: { title: string; tags: string[]; subtasks: { title: string; description: string }[] }) {
    return $api.post('tasks', { json: task });
  }

  static getTaskById(taskId: string) {
    return $api.get(`tasks/${taskId}`);
  }

  static updateSubtask(data: { subtask_id: string; status?: string; cause?: string }) {
    return $api.patch('tasks/update_subtask', { json: data });
  }

  static createTaskCsv(taskId: string) {
    return $api.get('tasks/create_task_csv', { searchParams: { taskId: taskId } });
  }

  static deleteSubtask(subtask_id: string, taskId: string) {
    return $api.delete('tasks/delete_subtask', { searchParams: { subtask_id, taskId } });
  }

  static moveSubtask(subtask_id: string, taskId: string, new_task_id: string) {
    return $api.patch('tasks/move_subtask', { json: { subtask_id, taskId, new_task_id } });
  }
}
