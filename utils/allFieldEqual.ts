import NoteSchema from '../model/NoteSchema';

function areAllFieldsEqual(objects: NoteSchema[], fieldName: keyof NoteSchema) {
  if (objects.length < 2) {
    // Nếu danh sách chỉ có 1 hoặc không có đối tượng nào, luôn trả về true
    return true;
  }
  if (!(fieldName in objects[0])) {
    return false;
  }
  const firstValue = objects[0][fieldName];
  if (firstValue === undefined) {
    return false;
  }
  // Kiểm tra xem giá trị trường của mỗi đối tượng có giống với giá trị của đối tượng đầu tiên không
  return objects.every(obj => obj.color === firstValue);
}

export default areAllFieldsEqual;
