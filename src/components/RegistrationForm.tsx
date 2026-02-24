import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, CheckCircle2, AlertCircle, QrCode, Copy, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ALL_EVENTS } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

const schema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  collegeName: z.string().min(3, 'College name is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  selectedEvents: z.array(z.string()).min(1, 'Select at least one event'),
  transactionId: z.string().min(6, 'Valid transaction ID is required'),
});

type FormData = z.infer<typeof schema>;

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      selectedEvents: [],
    },
  });

  const selectedEvents = watch('selectedEvents');

  const onDrop = (acceptedFiles: File[]) => {
    setScreenshot(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  } as any);

  const onSubmit = async (data: FormData) => {
    if (!screenshot) {
      alert('Please upload payment screenshot');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'selectedEvents') {
        formData.append(key, (value as string[]).join(', '));
      } else {
        formData.append(key, value as string);
      }
    });
    formData.append('screenshot', screenshot);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setSuccessData(result);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#3b82f6', '#f97316'],
        });
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  if (successData) {
    return (
      <section id="register" className="py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-10 rounded-3xl text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold font-display mb-2">Registration Successful!</h2>
            <p className="text-white/60 mb-8">Your registration ID is <span className="text-cyber-purple font-bold">{successData.registrationId}</span>. A confirmation email has been sent.</p>
            
            <div className="bg-white p-4 rounded-2xl inline-block mb-8">
              <img src={successData.qrCodeData} alt="QR Ticket" className="w-48 h-48" />
            </div>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={() => window.print()}
                className="w-full py-4 bg-cyber-purple rounded-xl font-bold"
              >
                Download Ticket
              </button>
              <button
                onClick={() => setSuccessData(null)}
                className="w-full py-4 glass rounded-xl font-bold"
              >
                Register Another
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-display mb-4">Secure Your <span className="text-cyber-purple">Spot</span></h2>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                  step >= i ? 'bg-cyber-purple text-white' : 'glass text-white/40'
                )}
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 md:p-12 rounded-3xl"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Full Name</label>
                  <input
                    {...register('fullName')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">College Name</label>
                  <input
                    {...register('collegeName')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                    placeholder="Enter your college"
                  />
                  {errors.collegeName && <p className="text-red-500 text-xs mt-1">{errors.collegeName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Department</label>
                  <input
                    {...register('department')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                    placeholder="e.g. IT, CSE"
                  />
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Year</label>
                  <select
                    {...register('year')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                  >
                    <option value="" className="bg-cyber-bg">Select Year</option>
                    <option value="1" className="bg-cyber-bg">1st Year</option>
                    <option value="2" className="bg-cyber-bg">2nd Year</option>
                    <option value="3" className="bg-cyber-bg">3rd Year</option>
                    <option value="4" className="bg-cyber-bg">4th Year</option>
                  </select>
                  {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Email Address</label>
                  <input
                    {...register('email')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Phone Number</label>
                  <input
                    {...register('phone')}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                    placeholder="10-digit number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2 flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-10 py-4 bg-cyber-purple rounded-xl font-bold"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Select Your Events</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {ALL_EVENTS.map((event) => (
                      <label
                        key={event.id}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                          selectedEvents.includes(event.name)
                            ? 'bg-cyber-purple/20 border-cyber-purple'
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        )}
                      >
                        <input
                          type="checkbox"
                          value={event.name}
                          {...register('selectedEvents')}
                          className="w-5 h-5 accent-cyber-purple"
                        />
                        <div>
                          <p className="font-bold text-sm">{event.name}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{event.category}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.selectedEvents && <p className="text-red-500 text-xs mt-2">{errors.selectedEvents.message}</p>}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-4 glass rounded-xl font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-10 py-4 bg-cyber-purple rounded-xl font-bold"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Payment Verification</h3>
                  <p className="text-white/60 mb-8">Scan the QR code below and pay ₹300 to complete your registration.</p>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                    <div className="bg-white p-6 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      {/* Placeholder for UPI QR */}
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-black">
                        <QrCode className="w-32 h-32" />
                      </div>
                      <p className="text-black text-xs font-bold mt-4 uppercase tracking-widest">Scan to Pay</p>
                    </div>
                    
                    <div className="text-left space-y-4 max-w-xs">
                      <div className="p-4 glass rounded-2xl">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">UPI ID</p>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-cyber-purple">velonix2k26@upi</span>
                          <button type="button" className="text-white/40 hover:text-white"><Copy className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-4 glass rounded-2xl">
                        <p className="text-xs text-white/40 uppercase font-bold mb-1">Amount</p>
                        <p className="text-2xl font-bold">₹300.00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Transaction ID</label>
                    <input
                      {...register('transactionId')}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none transition-colors"
                      placeholder="Enter UPI Ref No."
                    />
                    {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/60 uppercase tracking-widest">Payment Screenshot</label>
                    <div
                      {...getRootProps()}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all h-[52px] flex items-center justify-center',
                        isDragActive ? 'border-cyber-purple bg-cyber-purple/10' : 'border-white/10 hover:border-white/30'
                      )}
                    >
                      <input {...getInputProps()} />
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Upload className="w-4 h-4" />
                        {screenshot ? screenshot.name : 'Upload Screenshot'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-4 glass rounded-xl font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-gradient-to-r from-cyber-purple to-cyber-blue rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationForm;
