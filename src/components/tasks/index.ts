import TasksCreateFirstStep from './TasksCreateFirstStep.vue';
import TasksCreateSecondStep from './TasksCreateSecondStep.vue';
import TasksSubtasksTable from './TasksSubtasksTable.vue';
import TaskByIdTask from './TaskByIdTask.vue';
import TaskByIdTaskSubtasks from './TaskByIdTaskSubtasks.vue';
import TaskByIdModalMove from './TaskByIdModalMove.vue';

export default class Tasks {
  static CreateFirstStep = TasksCreateFirstStep;
  static CreateSecondStep = TasksCreateSecondStep;
  static SubtasksTable = TasksSubtasksTable;
  static TaskById = TaskByIdTask;
  static TaskByIdSubtasks = TaskByIdTaskSubtasks;
  static TaskByIdModalMove = TaskByIdModalMove;
}
