import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { staggerContainer, fadeUp } from '../../animation/variants';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authService.login(username, password);
      localStorage.setItem('token', data.token);
      login(data);
      // The redirect is handled in AuthLayout based on user role
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div variants={fadeUp} className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
      </motion.div>

      {error && (
        <motion.div 
          variants={fadeUp}
          className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={fadeUp} className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="Enter your username"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Forgot password?
          </a>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full h-12 flex justify-center text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      <motion.p variants={fadeUp} className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
          Create one now
        </Link>
      </motion.p>
    </motion.div>
  );
};
