import NoteSchema from '../model/NoteSchema';

function checkPinNote(notes: NoteSchema[]) {
  // Sử dụng every() để kiểm tra xem tất cả các đối tượng có trường isPinned đều là true
  let allPinned = notes.every(item => item.isPinned === true);

  // Nếu tất cả là true, trả về true
  if (allPinned) {
    return true;
  }

  // Nếu tất cả là false, trả về false
  let allNotPinned = notes.every(item => item.isPinned === false);
  if (allNotPinned) {
    return false;
  }

  // Nếu không đồng nhất, trả về false
  return false;
}

export default checkPinNote;
