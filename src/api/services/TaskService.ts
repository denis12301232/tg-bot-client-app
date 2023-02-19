import type { ITask } from '@/types/interfaces'
import $api from '@/api'


export default class TaskService {
   static createTask(title: string, tags: string[], description: string, date: string) {
      return $api.post('/tasks/create', { title, tags, description, date });
   }

   static getTasks() {
      return $api.get<ITask[]>('/tasks');
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

}