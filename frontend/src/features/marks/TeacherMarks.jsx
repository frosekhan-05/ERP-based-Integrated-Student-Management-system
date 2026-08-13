import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Loader2 } from 'lucide-react';
import teacherService from '../../services/teacherService';
import marksService from '../../services/marksService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { toast } from 'react-toastify';

export const TeacherMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examName, setExamName] = useState('Mid-Term Exam');
  const [maxMarks, setMaxMarks] = useState(100);
  
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    teacherService.getSubjects().then(data => {
      setSubjects(data || [{ id: 1, name: 'Computer Science 101' }, { id: 2, name: 'Data Structures' }]);
      if (data && data.length > 0) setSelectedSubject(data[0].id);
    }).catch(err => {
      setSubjects([{ id: 1, name: 'Computer Science 101' }, { id: 2, name: 'Data Structures' }]);
      setSelectedSubject(1);
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    }
  }, [selectedSubject]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getStudents().catch(() => [
        { id: 101, studentId: 'S101', name: 'Alice Johnson' },
        { id: 102, studentId: 'S102', name: 'Bob Smith' },
        { id: 103, studentId: 'S103', name: 'Charlie Brown' }
      ]);
      setStudents(data || []);
      
      const initialMarks = {};
      (data || []).forEach(s => {
        initialMarks[s.id] = '';
      });
      setMarks(initialMarks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveMarks = async () => {
    setIsSaving(true);
    try {
      const payload = students.filter(s => marks[s.id] !== '').map(s => ({
        studentId: s.id,
        subjectId: selectedSubject,
        examName: examName,
        marksObtained: parseFloat(marks[s.id]),
        maxMarks: parseFloat(maxMarks)
      }));
      
      if (payload.length === 0) {
        toast.warning("Please enter marks for at least one student");
        setIsSaving(false);
        return;
      }
      
      await marksService.uploadBulkMarks(payload);
      toast.success("Marks uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload marks");
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Marks</h1>
          <p className="text-slate-500 dark:text-slate-400">Enter and publish student grades</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Type</label>
              <select 
                value={examName} 
                onChange={e => setExamName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Mid-Term Exam">Mid-Term Exam</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Marks</label>
              <input 
                type="number" 
                value={maxMarks}
                onChange={e => setMaxMarks(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4 w-48">Marks Obtained</th>
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
                      No students found
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
                        <input 
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={marks[student.id] || ''}
                          onChange={e => handleMarkChange(student.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                          placeholder={`/ ${maxMarks}`}
                        />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
             <Button onClick={handleSaveMarks} disabled={isSaving || students.length === 0} className="flex items-center gap-2">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                {isSaving ? 'Uploading...' : 'Publish Marks'}
              </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
