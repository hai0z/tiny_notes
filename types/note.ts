import {BSON} from 'realm';

interface Note {
  _id: BSON.ObjectId;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  is_deleted: boolean;
  isPinned: boolean;
  isCompleted: boolean;
  color: string;
  image: string;
  device_id: string;
}
export default Note;
