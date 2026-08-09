import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, CheckCircle2, AlertCircle, ArrowUpRight, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AnimatedNumber } from '../../animation/AnimatedNumber';
import { staggerContainer, fadeUp } from '../../animation/variants';
import { AuthContext } from '../../context/AuthContext';
import feesService from '../../services/feesService';
import { Skeleton } from '../../components/ui/Skeleton';

export const StudentFees = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [upcomingFees, setUpcomingFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      if (!user) return;
      try {
        const response = await feesService.getFeesSummaryByStudent(user.id);
        const data = response.data;
        if (data) {
          setStats({
            totalFees: data.totalFees || 0,
            paidFees: data.paidAmount || 0,
            dueFees: data.dueAmount || 0,
          });

          const allFees = data.history || [];
          
          const completedTxns = allFees.filter(f => f.status === 'PAID' || f.status === 'PARTIAL').map(f => ({
            id: f.transactionId || `TXN-${f.id}`,
            date: f.paymentDate || 'Unknown',
            amount: f.paidAmount,
            description: f.description || 'Fee Payment',
            status: 'completed',
            method: f.paymentMode || 'Unknown',
            receiptNo: f.receiptNo
          }));
          
          const pending = allFees.filter(f => f.status !== 'PAID').map(f => ({
            id: f.id,
            description: f.description || 'Pending Fee',
            dueDate: f.dueDate || 'Unknown',
            amount: f.dueAmount,
            status: f.status.toLowerCase()
          }));

          setTransactions(completedTxns);
          setUpcomingFees(pending);
        }
      } catch (error) {
        console.error("Failed to fetch fees", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFees();
  }, [user]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your payments, dues, and download receipts.</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
              <div className="relative z-10">
                <p className="text-indigo-100 font-medium">Total Fees (Academic Year)</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${stats ? <AnimatedNumber value={stats.totalFees} /> : '0'}
                </h3>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
                <CreditCard size={120} />
              </div>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
              <div className="relative z-10">
                <p className="text-emerald-100 font-medium">Total Paid</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${stats ? <AnimatedNumber value={stats.paidFees} /> : '0'}
                </h3>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
                <CheckCircle2 size={120} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0">
              <div className="relative z-10">
                <p className="text-rose-100 font-medium">Pending Dues</p>
                <h3 className="text-3xl font-bold mt-2">
                  ${stats ? <AnimatedNumber value={stats.dueFees} /> : '0'}
                </h3>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 scale-150 translate-x-4 translate-y-4">
                <AlertCircle size={120} />
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                {transactions.length > 0 && (
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                    View all <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((txn, i) => (
                    <motion.div 
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mr-4 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{txn.description}</h4>
                          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1 space-x-2">
                            <span>{txn.date}</span>
                            <span>•</span>
                            <span>{txn.method}</span>
                            <span>•</span>
                            <span className="font-mono text-xs truncate max-w-[100px]">{txn.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 pl-4">
                        <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(txn.amount)}</span>
                        {txn.receiptNo && (
                          <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 flex items-center" title={`Receipt: ${txn.receiptNo}`}>
                            <Download size={12} className="mr-1" /> Receipt
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <Search size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No transactions found.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={fadeUp}>
            <Card className="p-6 border-l-4 border-l-amber-500 min-h-[200px]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Payment</h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
              ) : upcomingFees.length > 0 ? (
                upcomingFees.map(fee => (
                  <div key={fee.id} className="mb-6 last:mb-0">
                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{fee.description}</p>
                    </div>
                    
                    <div className="flex justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Due Date</p>
                        <p className="font-semibold text-rose-600 dark:text-rose-400">{fee.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</p>
                        <p className="font-bold text-xl text-slate-900 dark:text-white">{formatCurrency(fee.amount)}</p>
                      </div>
                    </div>
                    
                    <Button className="w-full justify-center flex items-center space-x-2">
                      <CreditCard size={18} />
                      <span>Pay Now</span>
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center">
                      <CheckCircle2 size={12} className="mr-1 text-emerald-500" /> Secure encrypted payment
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-emerald-500">
                  <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">You're all caught up!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No pending fees.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
