import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  fromEmail: { type: String, default: 'jobboard326@gmail.com' },
  template: { type: String, default: 'New Application Notification' },
  siteName: { type: String, default: 'JOBBOARD' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  timezone: { type: String, default: 'IST (UTC +5:30)' }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);