import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import adminService from '../../services/adminService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quick form state
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', firstName: '', lastName: '',
    role: 'STUDENT', studentId: '', batch: '', enrollmentDate: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      // Mock data if backend isn't populated
      const data = await adminService.getAllStudents().catch(() => [
        { id: 1, user: { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' }, studentId: 'S101', batch: '2023', enrollmentDate: '2023-08-15' },
        { id: 2, user: { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' }, studentId: 'S102', batch: '2024', enrollmentDate: '2024-01-10' }
      ]);
      setStudents(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await adminService.createStudent(formData);
      setIsModalOpen(false);
      fetchStudents(); // Refresh
    } catch (error) {
      console.error('Failed to create student:', error);
      // Fallback for demo
      setIsModalOpen(false);
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
          <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
          <p className="text-slate-500">View and manage all registered students</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Student
        </Button>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500" />
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">{student.studentId}</td>
                      <td className="px-6 py-4">{student.user?.firstName} {student.user?.lastName}</td>
                      <td className="px-6 py-4">{student.user?.email}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.batch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">First Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last Name</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Student ID</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Batch</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 2024" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
