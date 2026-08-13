import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Loader2, Save } from 'lucide-react';
import teacherService from '../../services/teacherService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { toast } from 'react-toastify';

export const TeacherAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch subjects assigned to this teacher
    teacherService.getSubjects().then(data => {
      setSubjects(data || [{ id: 1, name: 'Computer Science 101' }, { id: 2, name: 'Data Structures' }]);
      if (data && data.length > 0) setSelectedSubject(data[0].id);
    }).catch(err => {
      console.error(err);
      setSubjects([{ id: 1, name: 'Computer Science 101' }, { id: 2, name: 'Data Structures' }]);
      setSelectedSubject(1);
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    }
  }, [selectedSubject, selectedDate]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Mocked student list for demo if API fails
      const data = await teacherService.getStudents().catch(() => [
        { id: 101, studentId: 'S101', name: 'Alice Johnson' },
        { id: 102, studentId: 'S102', name: 'Bob Smith' },
        { id: 103, studentId: 'S103', name: 'Charlie Brown' }
      ]);
      setStudents(data || []);
      
      // Initialize attendance state (defaults to PRESENT)
      const initialAttendance = {};
      (data || []).forEach(s => {
        initialAttendance[s.id] = 'PRESENT';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const payload = students.map(s => ({
        studentId: s.id,
        subjectId: selectedSubject,
        date: selectedDate,
        status: attendance[s.id]
      }));
      
      await teacherService.markBulkAttendance(payload);
      toast.success("Attendance marked successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mark Attendance</h1>
          <p className="text-slate-500 dark:text-slate-400">Record daily student attendance for your classes</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Subject</label>
              <select 
                value={selectedSubject} 
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name || sub.subjectName}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveAttendance} disabled={isSaving || students.length === 0} className="w-full md:w-auto flex items-center justify-center gap-2">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Attendance
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" />
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-slate-500">
                      No students enrolled in this subject
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.studentId}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${attendance[student.id] === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
                          >
                            <CheckCircle size={14} /> Present
                          </button>
                          <button 
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${attendance[student.id] === 'ABSENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
                          >
                            <XCircle size={14} /> Absent
                          </button>
                          <button 
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${attendance[student.id] === 'LATE' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'}`}
                          >
                            <Clock size={14} /> Late
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
