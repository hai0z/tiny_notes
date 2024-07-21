import Realm, {BSON, ObjectSchema} from 'realm';

class TaskSchema extends Realm.Object<TaskSchema> {
  _id!: BSON.ObjectId;
  title!: string;
  owner_id!: string;
  created_at!: Date;
  updated_at!: Date;
  isCompleted!: boolean;
  orderIndex!: number;
  static schema: ObjectSchema = {
    name: 'Task',
    properties: {
      _id: {
        type: 'objectId',
      },
      owner_id: 'string',
      title: 'string',

      created_at: {
        type: 'date',
        default: () => {
          return new Date();
        },
      },
      updated_at: {
        type: 'date',
        default: () => {
          return new Date();
        },
      },
      isCompleted: {
        type: 'bool',
        default: false,
      },
      orderIndex: {
        type: 'int',
      },
    },
    primaryKey: '_id',
  };
}

export default TaskSchema;
