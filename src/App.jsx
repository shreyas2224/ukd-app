import React, { useState } from 'react';
import { supabase } from './supabase';

export default function App() {
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    constituency: '56-Lalkuan',
    donation: ''
  });

  // Problem Report State
  const [problemData, setProblemData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
  });

  const [step, setStep] = useState('FORM'); // 'FORM' | 'PAYMENT' | 'SUCCESS' | 'ALREADY_JOINED'
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [problemLoading, setProblemLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProblemChange = (e) => {
    setProblemData({ ...problemData, [e.target.name]: e.target.value });
  };

  // Step 1: Form Validation & Duplicate Check
  const handleProceedToPayment = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.district) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser, error: checkError } = await supabase
        .from("registrations")
        .select("*")
        .or(`phone.eq.${formData.phone},Email.eq.${formData.email}`);

      if (checkError) throw checkError;

      if (existingUser && existingUser.length > 0) {
        const foundMemberId = existingUser[0]["Member id"] || existingUser[0].id;
        setMemberId(foundMemberId);
        setStep('ALREADY_JOINED');
        setLoading(false);
        return;
      }

      setStep('PAYMENT');

    } catch (err) {
      console.error("Check error:", err);
      alert(`Error checking user status: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Post-Payment Save & Email Trigger
  const handlePaymentSuccess = async () => {
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        Email: formData.email,
        district: formData.district,
        constituency: formData.constituency,
        Joining_fee: 20,
        Donation: Number(formData.donation || 0),
      };

      const { data, error } = await supabase
        .from("registrations")
        .insert([payload])
        .select();

      if (error) throw error;

      const generatedId = data[0]?.["Member id"] || data[0]?.id || `UKD-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
      setMemberId(generatedId);
      setStep('SUCCESS');

      try {
        await fetch('/api/send-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            memberId: generatedId,
            district: formData.district,
            constituency: formData.constituency
          }),
        });
      } catch (emailErr) {
        console.error("Failed to trigger email:", emailErr);
      }

    } catch (err) {
      console.error("Registration error:", err);
      alert(`Error processing registration: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Problem Report Submission
  const handleProblemSubmit = async (e) => {
    e.preventDefault();

    if (!problemData.name || !problemData.address || !problemData.phone || !problemData.description) {
      alert("Please fill in all fields for the problem report.");
      return;
    }

    setProblemLoading(true);

    try {
     const payload = {
        id: `UKD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: problemData.name,
        address: problemData.address,
        phone: problemData.phone,
        issue: problemData.description
      };

      const { error } = await supabase
        .from("problems")
        .insert([payload]);

      if (error) throw error;

      alert("Grievance/Problem reported successfully!");
      setProblemData({ name: '', address: '', phone: '', description: '' });

    } catch (err) {
      console.error("Problem submission error:", err);
      alert(`Error saving to database: ${err.message || JSON.stringify(err)}`);
    } finally {
      setProblemLoading(false);
    }
  };

  const totalAmount = 20 + Number(formData.donation || 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-emerald-900 border-b border-emerald-800 p-4 text-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wider text-emerald-400">UKD DIGITAL COMMAND PORTAL</h1>
        <p className="text-sm text-slate-300">Uttarakhand Kranti Dal - Official Membership Drive & Grievance Portal</p>
      </header>

      {/* Hero Section with Lalkuan Banner */}
      <div className="bg-gradient-to-b from-green-900 to-green-950 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-2xl border border-white/20">
          
          {/* Banner Image */}
          <div className="mb-5 rounded-xl overflow-hidden shadow-lg border-2 border-amber-400">
            <img 
              src="/laltuan-banner.jpeg" 
              alt="56-Lalkuan Vidhan Sabha - Bhuwan Singh Bisht" 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Key Highlights */}
          <div className="space-y-2 mb-6 bg-black/30 p-4 rounded-xl border border-white/10 text-sm">
            <h3 className="text-lg font-bold text-amber-300 mb-2">56-लालकुआं विधानसभा (उत्तराखंड क्रांति दल)</h3>
            <div className="flex items-start gap-2"><span className="text-green-400 font-bold">✓</span><p>क्षेत्र के विकास के लिए संकल्पबद्ध</p></div>
            <div className="flex items-start gap-2"><span className="text-green-400 font-bold">✓</span><p>युवाओं के लिए रोजगार और शिक्षा</p></div>
            <div className="flex items-start gap-2"><span className="text-green-400 font-bold">✓</span><p>पहाड़ और मैदान दोनों के लिए समान विकास</p></div>
            <div className="flex items-start gap-2"><span className="text-green-400 font-bold">✓</span><p>जनता की आवाज, जनता के साथ</p></div>
          </div>

          <div className="text-center bg-gradient-to-r from-red-700 to-green-800 p-4 rounded-xl shadow-inner">
            <h4 className="text-md md:text-lg font-bold text-yellow-200">आइए, इस बार उत्तराखंड की आवाज को और मजबूत बनाएं...</h4>
            <p className="text-xl font-extrabold text-white mt-1">इस बार UKD को वोट दें 🗳️</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-xl mx-auto p-6 bg-slate-800 rounded-xl shadow-xl my-8 border border-slate-700 w-full space-y-10">
        
        {/* SECTION 1: MEMBERSHIP DRIVE & PAYMENT WORKFLOW */}
        <section className="border-b border-slate-700 pb-8">
          {/* STEP 1: FORM */}
          {step === 'FORM' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-emerald-300 mb-4">New Member Registration</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Nainital, Dehradun"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Constituency</label>
                <input
                  type="text"
                  name="constituency"
                  value={formData.constituency}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Assembly constituency"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Optional Donation (₹)</label>
                <input
                  type="number"
                  name="donation"
                  value={formData.donation}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter donation amount if any"
                />
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-xs text-slate-300">
                Mandatory Membership Fee: <span className="font-bold text-emerald-400">₹20</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-200 mt-4 disabled:opacity-50"
              >
                {loading ? "Checking Details..." : `Proceed to Pay ₹${totalAmount}`}
              </button>
            </form>
          )}

          {/* STEP 2: GPAY / UPI QR PAYMENT SCREEN */}
          {step === 'PAYMENT' && (
            <div className="space-y-4 text-center py-2">
              <h2 className="text-xl font-bold text-white">Scan QR Code to Pay Fee</h2>
              
              <div className="bg-white p-4 rounded-xl inline-block shadow-lg my-2">
                <img 
                  src="/gpay-qr.png" 
                  alt="GPay QR Code" 
                  className="w-48 h-48 mx-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ukd-official@upi&pn=Uttarakhand%20Kranti%20Dal&am=' + totalAmount;
                  }}
                />
                <p className="text-slate-800 text-xs font-semibold mt-2">Scan with Google Pay, PhonePe, Paytm</p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-left space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Membership Fee:</span>
                  <span className="text-white">₹20</span>
                </div>
                {Number(formData.donation) > 0 && (
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Donation:</span>
                    <span className="text-white">₹{formData.donation}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Total Payable:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handlePaymentSuccess}
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
                >
                  {loading ? "Verifying & Registering..." : "I Have Completed Payment"}
                </button>

                <button
                  onClick={() => setStep('FORM')}
                  disabled={loading}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition"
                >
                  Back to Edit Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ALREADY JOINED */}
          {step === 'ALREADY_JOINED' && (
            <div className="text-center space-y-4 py-6">
              <div className="text-amber-400 text-5xl mb-2">ℹ️</div>
              <h2 className="text-2xl font-bold text-white">Already Joined!</h2>
              <p className="text-slate-300">You are already a registered member of Uttarakhand Kranti Dal.</p>
              
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 my-4 text-left">
                <p className="text-sm text-slate-400">Your Existing Member ID:</p>
                <p className="text-xl font-mono font-bold text-amber-400">{memberId}</p>
              </div>

              <button
                onClick={() => {
                  setStep('FORM');
                  setFormData({ name: '', phone: '', email: '', district: '', constituency: '56-Lalkuan', donation: '' });
                }}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
              >
                Back to Home
              </button>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="text-center space-y-4 py-6">
              <div className="text-emerald-400 text-5xl mb-2">✓</div>
              <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
              <p className="text-slate-300">Fee payment acknowledged. Welcome to Uttarakhand Kranti Dal!</p>
              
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 my-4 text-left">
                <p className="text-sm text-slate-400">Your Assigned Member ID:</p>
                <p className="text-xl font-mono font-bold text-emerald-400">{memberId}</p>
              </div>

              <p className="text-xs text-slate-400">A welcome confirmation email with your digital ID card has been dispatched to your inbox.</p>
              
              <button
                onClick={() => {
                  setStep('FORM');
                  setFormData({ name: '', phone: '', email: '', district: '', constituency: '56-Lalkuan', donation: '' });
                }}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition"
              >
                Register Another Member
              </button>
            </div>
          )}
        </section>

        {/* SECTION 2: NEW PROBLEM / GRIEVANCE REPORT */}
        <section>
          <form onSubmit={handleProblemSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-emerald-300 mb-4">New Problem Report</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Your Name *</label>
              <input
                type="text"
                name="name"
                value={problemData.name}
                onChange={handleProblemChange}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Address / Ward / Village *</label>
              <input
                type="text"
                name="address"
                value={problemData.address}
                onChange={handleProblemChange}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Enter location/address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={problemData.phone}
                onChange={handleProblemChange}
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="10-digit mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Issue Description *</label>
              <textarea
                name="description"
                value={problemData.description}
                onChange={handleProblemChange}
                required
                rows="3"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                placeholder="Describe the problem..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={problemLoading}
              className="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
            >
              {problemLoading ? "Submitting Grievance..." : "Submit Grievance"}
            </button>
          </form>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-slate-300 text-center py-4 border-t border-emerald-900 text-xs">
        <p>Uttarakhand Kranti Dal | Official Digital Command Portal</p>
      </footer>
    </div>
  );
<div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 my-4 text-center">
  <h3 className="text-sm font-bold text-amber-300 mb-3">Scan QR to Access Portal</h3>
  <div className="bg-white p-3 rounded-xl shadow-lg inline-block">
    <img 
      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent("https://ukd-app.vercel.app")}`} 
      alt="Portal QR Code" 
      className="w-40 h-40 object-contain mx-auto"
    />
  </div>
  <p className="text-xs text-green-300 mt-2 font-medium">Clear scan on Mobile, PC & iOS</p>
</div>}
