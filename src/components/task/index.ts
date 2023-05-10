import TaskByIdModalDelete from './TaskByIdModalDelete.vue';
import TaskByIdModalMove from './TaskByIdModalMove.vue';
import TaskByIdSubtasks from './TaskByIdSubtasks.vue';
import TaskByIdTask from './TaskByIdTask.vue';
import TaskCreateFirstStep from './TaskCreateFirstStep.vue';
import TaskCreateSecondStep from './TaskCreateSecondStep.vue';


export default class Task {
   static readonly ModalDelete = TaskByIdModalDelete;
   static readonly ModalMove = TaskByIdModalMove;
   static readonly Subtasks = TaskByIdSubtasks;
   static readonly Task = TaskByIdTask;
   static readonly CreateFirstStep = TaskCreateFirstStep;
   static readonly CreateSecondStep = TaskCreateSecondStep;
}