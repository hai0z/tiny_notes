import Realm, {BSON, ObjectSchema} from 'realm';
class NoteSchema extends Realm.Object<NoteSchema> {
  _id!: BSON.ObjectId;
  title!: string;
  content!: string;
  created_at!: string;
  updated_at?: Date;
  deleted_at!: Date;
  is_deleted!: boolean;
  isPinned!: boolean;
  isCompleted!: boolean;
  color!: string;
  image?: string;
  is_archived!: boolean;
  owner_id!: string;
  isLocked!: boolean;
  static schema: ObjectSchema = {
    name: 'Note',
    properties: {
      _id: {
        type: 'objectId',
      },
      owner_id: 'string',
      title: 'string',
      content: 'string',
      isCheckList: {
        type: 'bool',
        default: false,
      },
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
      deleted_at: {
        type: 'date',

        optional: true,
      },
      is_deleted: {
        type: 'bool',
        default: false,
      },
      isPinned: {
        type: 'bool',
        default: false,
      },
      isCompleted: {
        type: 'bool',
        default: false,
      },
      color: {
        type: 'string',
        default: 'transparent',
      },
      image: {
        type: 'string',
        optional: true,
      },
      is_archived: {
        type: 'bool',
        default: false,
      },
      isLocked: {
        type: 'bool',
        default: false,
      },
    },
    primaryKey: '_id',
  };
}

export default NoteSchema;
