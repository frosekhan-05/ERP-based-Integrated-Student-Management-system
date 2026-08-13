import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Loader2, BookOpen } from 'lucide-react';
import courseService from '../../services/courseService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { toast } from 'react-toastify';

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    courseName: '', courseCode: '', duration: 4
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getAllCourses().catch(() => [
        { id: 1, courseName: 'Computer Science', courseCode: 'CS-BTECH', duration: 4 },
        { id: 2, courseName: 'Electrical Engineering', courseCode: 'EE-BTECH', duration: 4 }
      ]);
      setCourses(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await courseService.createCourse(formData);
      setIsModalOpen(false);
      toast.success("Course added successfully");
      fetchCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
      toast.error("Failed to add course");
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">View and manage academic programs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Add Course
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="p-6 h-40 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </Card>
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No courses found
          </div>
        ) : (
          courses.map(course => (
            <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <BookOpen size={24} />
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.courseName}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{course.courseCode}</p>
                <div className="flex items-center mt-4 text-sm text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800">
                    Duration: {course.duration} Years
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
        <form onSubmit={handleAddCourse} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Course Name</label>
            <input type="text" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" placeholder="e.g. Computer Science Engineering" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Course Code</label>
              <input type="text" value={formData.courseCode} onChange={e => setFormData({...formData, courseCode: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" placeholder="e.g. CS-BTECH" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Duration (Years)</label>
              <input type="number" min="1" max="6" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Course</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
