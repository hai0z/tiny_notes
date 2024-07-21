import {createRealmContext} from '@realm/react';
import Note from '../model/NoteSchema';
export const realmConfig = {
  schema: [Note],

  schemaVersion: 1,
  deleteRealmIfMigrationNeeded: true,
};
// pass the configuration object with the updated 'schemaVersion' to createRealmContext()
const {RealmProvider} = createRealmContext(realmConfig);
export const useRealmContext = () => {
  return createRealmContext(realmConfig);
};
export default RealmProvider;
