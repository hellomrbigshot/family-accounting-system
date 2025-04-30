import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Room', RoomSchema); 