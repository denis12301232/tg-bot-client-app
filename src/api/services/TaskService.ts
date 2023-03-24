import type { ITask } from '@/types'
import $api from '@/api'


export default class TaskService {
   static createTask(title: string, tags: string[], subtasks: any[]) {
      return $api.post('/tasks', { title, tags, subtasks });
   }

   static getTasks(params: { page: number, limit: number, sort: string, descending: boolean, filter: string }) {
      return $api.get<ITask[]>('/tasks', { params });
   }

   static updateTaskStatus(task_id: string, status: string) {
      return $api.patch('/tasks/update_task_status', { task_id, status });
   }

   static getTaskById(task_id: string) {
      return $api.get<ITask>('/tasks/get_task_by_id', { params: { task_id } });
   }

   static setUserForTask(task_id: string) {
      return $api.patch('/tasks/set_user_for_task', { task_id });
   }

   static updateSubtask({ subtask_id, status, cause }: { subtask_id: string, status?: string, cause?: string }) {
      return $api.patch('/tasks/update_subtask', { subtask_id, status, cause });
   }

   static deleteSubtask(subtask_id: string, task_id: string) {
      return $api.delete('/tasks/delete_subtask', { params: { subtask_id, task_id } });
   }

   static moveSubtask(subtask_id: string, task_id: string, new_task_id: string) {
      return $api.patch('/tasks/move_subtask', { subtask_id, task_id, new_task_id });
   }

   static async createTaskCsv(task_id: string) {
      return $api.get<Blob>('/tasks/create_task_csv', { params: { task_id },  responseType: 'blob'  });
   }
}