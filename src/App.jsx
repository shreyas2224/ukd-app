import { supabase } from './supabase';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { 
  Shield, Users, Newspaper, Calendar, FileText, Phone, 
  MapPin, CheckCircle, ChevronRight, Menu, X, ArrowRight,
  Award, Globe, HeartHandshake, Share2, Download, ExternalLink,
  Laptop, Search, Database, Lock, UserCheck, AlertCircle, Languages, LogIn, Send, Clock
} from 'lucide-react';

// Official UKD Flag & Symbol Component
const UKDFlagSymbol = ({ size = 36, className = "" }) => (
  <div className={`inline-flex rounded-lg overflow-hidden border border-emerald-700 shadow-md ${className}`} style={{ width: size * 1.6, height: size }}>
    <div className="bg-emerald-800 text-white flex flex-col items-center justify-center font-black tracking-wider px-1.5" style={{ width: '60%' }}>
      <span style={{ fontSize: size * 0.35, lineHeight: 1 }}>UKD</span>
    </div>
    <div className="flex flex-col" style={{ width: '40%' }}>
      <div className="bg-white flex items-center justify-center p-0.5" style={{ height: '50%' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M6 3v18" />
          <path d="M18 3v18" />
          <path d="M6 11h12" />
          <path d="M6 6h12" />
          <path d="M8 15h8" />
          <circle cx="12" cy="3" r="1.2" fill="black" />
        </svg>
      </div>
      <div className="bg-red-600" style={{ height: '50%' }}></div>
    </div>
  </div>
);

const districtsAndConstituencies = {
  "Almora": ["Almora", "Dwarahat", "Salt", "Ranikhet", "Someshwar"],
  "Bageshwar": ["Bageshwar", "Kaptankot"],
  "Chamoli": ["Badrinath", "Tharali", "Karnaprayag"],
  "Champawat": ["Champawat", "Lohaghat"],
  "Dehradun": ["Vikasnagar", "Sahaspur", "Raipur", "Rajpur Road", "Dehradun Cantt", "Mussoorie", "Rishikesh"],
  "Haridwar": ["Haridwar Rural", "Ranipur", "Jwalapur", "Bhagwanpur", "Jhabrera", "Piran Kaliyar", "Roorkee", "Khanpur", "Manglaur", "Laksar"],
  "Nainital": ["Lalkuan", "Haldwani", "Kaladhungi", "Ramnagar", "Bhimtal", "Nainital"],
  "Pauri Garhwal": ["Pauri", "Srinagar", "Thalisain", "Chaubattakhal", "Lansdowne", "Kotdwar"],
  "Pithoragarh": ["Pithoragarh", "Gangolihat", "Didihat", "Dharchula"],
  "Rudraprayag": ["Kedar Nath", "Rudraprayag"],
  "Tehri Garhwal": ["Tehri", "Pratapnagar", "Dhanaulti", "Narendranagar", "Ghansali"],
  "Udham Singh Nagar": ["Rudrapur", "Kichha", "Sitarganj", "Nanakmatta", "Khatima", "Jaspur", "Kashipur", "Bazpur"],
  "Uttarkashi": ["Gangotri", "Yamunotri", "Purola"]
};

const constituencyRegions = {
  "Lalkuan": ["Bindukhatta", "Halduchaur", "Gaujalali", "Chorgallia", "Lalkuan Town / Station Road", "Gaulapar", "Bareilly Road Corridor", "Halduchaur Dauliya", "Bachipur", "Gola Range"],
  "Haldwani": ["Ward No. 1 to 10 (Gorakhpur/Kathgodam)", "Ward No. 11 to 20 (Rampur Rd/Heeranagar)", "Ward No. 21 to 30 (Banbhoolpura/Indira Nagar)", "Ward No. 31 to 40 (Damuwadhunga/Bithoriya)", "Kathgodam", "Kusumkheda", "Uncha Pul", "Talla Bamori", "Malla Bamori"],
  "Kaladhungi": ["Kaladhungi Town", "Kota Bagh", "Kamola", "Chakalua", "Fattepur", "Bailparao", "Ladhora"],
  "Ramnagar": ["Ramnagar Market", "Kosi Barrage Area", "Pirumadara", "Dhela", "Chilkiya", "Shivlalpur", "Garjiya"],
  "Bhimtal": ["Bhimtal Lake Area", "Bhowali", "Sattal Road", "Naukuchiatal", "Pangot", "Okhalkanda", "Dhari", "Mukteshwar"],
  "Nainital": ["Mallital", "Tallital", "Ayarpata", "Sukhatal", "Pangot", "Khurpatal", "Jeolikote", "Kilbury"],
  "Dehradun Cantt": ["Ballupur", "Garhi Cantt", "Vijay Park", "Bindal", "Kaulagarh", "Anarwala", "Panditwari"],
  "Rajpur Road": ["Rajpur Village", "Dalanwala", "EC Road", "Karanpur", "Astley Hall Area", "Jakhan", "Pacific Mall Area"],
  "Raipur": ["Raipur Market", "Nehru Gram", "6th Avenue", "Miyawala", "Ladpur", "Nathuawala", "Maldevta"],
  "Rishikesh": ["Triveni Ghat", "Muni Ki Reti", "Rishikesh Town", "IDPL Colony", "Shyampur", "Babu Garh", "Gumaniwala"],
  "Mussoorie": ["Mall Road Mussoorie", "Landour", "Barloganj", "Library Bazaar", "Kempti Road", "Jharipani", "Bhatta Fall Area"],
  "Vikasnagar": ["Vikasnagar Main Market", "Dakpathar", "Herbertpur", "Kalsi", "Haringi", "Babar Range"],
  "Sahaspur": ["Sahaspur Town", "Selakui Industrial Area", "Sudhowala", "Jhajra", "Nanda Ki Chowki", "Premnagar"],
  "Haridwar Rural": ["Shantarshah", "Bahadrabad", "Ferupur", "Pathri", "Dhanpura", "Jamalpur"],
  "Roorkee": ["Roorkee Cantt", "Civil Lines Roorkee", "IIT Campus Area", "Ramnagar Roorkee", "Ganeshpur", "Saneh"],
  "Laksar": ["Laksar Town", "Sultanpur", "Khedi Kalan", "Raisi", "Bhopatpur"],
  "Rudrapur": ["Awas Vikas Rudrapur", "Indira Chowk Area", "Adarsh Colony", "Sidcul Sector 1-5", "Kashipur Bypass Area", "Pantnagar"],
  "Khatima": ["Khatima Town", "Chakarpur", "Jhinkiya", "Majhola", "Tanakpur Road Area", "Bigrabagh"],
  "Kashipur": ["Kashipur Market", "Aliganj Road", "Ramnagar Road Area", "Moriah Area", "Mahabir Colony"],
  "Kotdwar": ["Kotdwar Main Town", "Badrinath Road", "Balawala", "Haldukhata", "Saneh", "Kishanpur", "Kanvashram Area"],
  "Pauri": ["Pauri Market", "Choprin", "Bubakhal", "Ransi", "Kandoliya", "Gadoli"],
  "Srinagar": ["Srinagar Market", "NIT Campus Area", "Gantikhedi", "Srikot", "Kirtinagar Bridge Area"]
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'digital', 'login', 'problem'
  const [digitalSubTab, setDigitalSubTab] = useState('services');
  const [joinSubmitted, setJoinSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', district: '', constituency: '', region: '', role: 'Volunteer' });
  
  // Problem reporting state
  const [problems, setProblems] = useState([
    { id: 'UKD-2026-048', name: 'Ramesh Singh', address: 'Lalkuan Main Market', phone: '98370XXXXX', issue: 'Water supply disruption in ward 4', status: 'Resolved / हल हुआ' },
    { id: 'UKD-2026-049', name: 'Sunita Bisht', address: 'Haldwani Kathgodam', phone: '94120XXXXX', issue: 'Road repair needed near hill bypass', status: 'In Progress / प्रगति पर' }
  ]);
  const [probForm, setProbForm] = useState({ name: '', address: '', phone: '', issue: '' });
  const [probSubmitted, setProbSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Login form state
  const [loginRole, setLoginRole] = useState('District Coordinator');
  const [loginEmail, setLoginEmail] = useState('demo@ukd.org');
  const [loginPass, setLoginPass] = useState('********');

  const t = {
    en: {
      topTitle: "Uttarakhand Kranti Dal (UKD)",
      topSub: "Official Grassroots Movement",
      helpline: "Helpline: +91 (135) 000-0000",
      home: "Home",
      digital: "Digital Portal",
      internalLogin: "Internal Login",
      reportProb: "Report a Problem",
      joinMove: "Join Movement",
      heroBadge: "Uttarakhand Kranti Dal (UKD)",
      slogan: `"Jaagega Uttarakhand, Jeetega Uttarakhand"`,
      heroHeading: "जहाँ क्रांति दल है, वहाँ जवाब है।",
      heroSub: "निष्पक्ष दर्द, संघर्ष, और आम विधान पाहरा। उत्तराखंड क्रांति दल का जन पोर्टल - हर समस्या, हर घर में, समाधान तक चर्चा।",
      reportBtn: "समस्या दर्ज करें",
      statusBtn: "समस्या की स्थिति देखें",
      leadersTitle: "जिन्होंने पहाड़ की आवाज़ बुलंद की।",
      statsYears: "स्थापना वर्ष",
      statsDistricts: "जिले में संगठन",
      statsWorkers: "सक्रिय कार्यकर्ता",
      statsAssembly: "विधानसभा क्षेत्र",
      movementTitle: "एक आंदोलन, जिसकी कहानी जानना ज़रूरी है।",
      movementDesc: "राज्य आंदोलन की कथा को आप, पहाड़ से लेकर नगर, और हर कोने के लिए सुरक्षित रखें।",
      pillarsTitle: "पारदर्शिता, शुरुआत से।",
      p1: "कार्मिक घोषणापत्र", p2: "आर्थिक दस्तावेज", p3: "रिपोर्ट", p4: "प्रश्न संकल्प", p5: "संगठननात्मक सूचियां",
      footerRights: "© 2026 Uttarakhand Kranti Dal. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use"
    },
    hi: {
      topTitle: "उत्तराखंड क्रांति दल (UKD)",
      topSub: "आधिकारिक जन आन्दोलन",
      helpline: "हेल्पलाइन: +91 (135) 000-0000",
      home: "होम",
      digital: "डिजिटल पोर्टल",
      internalLogin: "आंतरिक लॉगिन (Login)",
      reportProb: "समस्या दर्ज करें",
      joinMove: "आंदोलन से जुड़ें",
      heroBadge: "उत्तराखंड क्रांति दल (UKD)",
      slogan: `"जागेगा उत्तराखंड, जीतेगा उत्तराखंड"`,
      heroHeading: "जहाँ क्रांति दल है, वहाँ जवाब है।",
      heroSub: "निष्पक्ष दर्द, संघर्ष, और आम विधान पाहरा। उत्तराखंड क्रांति दल का जन पोर्टल - हर समस्या, हर घर में, समाधान तक चर्चा।",
      reportBtn: "समस्या दर्ज करें",
      statusBtn: "समस्या की स्थिति देखें",
      leadersTitle: "जिन्होंने पहाड़ की आवाज़ बुलंद की।",
      statsYears: "1979",
      statsDistricts: "13",
      statsWorkers: "12",
      statsAssembly: "3",
      movementTitle: "एक आंदोलन, जिसकी कहानी जानना ज़रूरी है।",
      movementDesc: "राज्य आंदोलन की कथा को आप, पहाड़ से लेकर नगर, और हर कोने के लिए सुरक्षित रखें।",
      pillarsTitle: "पारदर्शिता, शुरुआत से।",
      p1: "कार्मिक घोषणापत्र", p2: "आर्थिक दस्तावेज", p3: "रिपोर्ट", p4: "प्रश्न संकल्प", p5: "संगठननात्मक सूचियां",
      footerRights: "© 2026 उत्तराखंड क्रांति दल। सर्वाधिकार सुरक्षित।",
      privacy: "गोपनीयता नीति",
      terms: "उपयोग की शर्तें"
    }
  };

  const text = t[lang];

 const handleProblemSubmit = async (e) => {
  e.preventDefault();
  if (probForm.name && probForm.phone && probForm.issue) {
    const newId = `UKD-2026-05${problems.length + 1}`;
    const newProblem = { id: newId, ...probForm, status: 'Pending / लंबित' };

    // Supabase database table mein insert karein
    const { error } = await supabase
      .from('problems')
      .insert([newProblem]);

    if (!error) {
      setProblems([newProblem, ...problems]);
      setProbSubmitted(true);
      setProbForm({ name: '', address: '', phone: '', issue: '' });
    } else {
      console.error('Supabase Error:', error);
      alert('Error saving to database. Please check Supabase RLS policies.');
    }
  }
};
const handleJoinSubmit = async (e) => {
  e.preventDefault();
  if (formData.name && formData.phone) {
    const { error } = await supabase
      .from('registrations')
      .insert([formData]);

    if (!error) {
      setJoinSubmitted(true);
    } else {
      console.error('Supabase Error:', error);
      alert('Error saving registration. Please check table policies.');
    }
  }
};
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b-2 border-red-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} className="text-amber-400" /> {text.topTitle}</span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline text-emerald-200">{text.topSub}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1"><Phone size={13} className="text-amber-400" /> {text.helpline}</span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <UKDFlagSymbol size={44} />
              <div>
                <h1 className="text-xl font-black tracking-tight text-emerald-950 leading-none">UKD PORTAL</h1>
                <p className="text-xs text-red-600 font-bold mt-1">Uttarakhand Kranti Dal</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-5 font-semibold text-sm items-center">
              <button onClick={() => setActiveTab('home')} className={`transition hover:text-emerald-700 ${activeTab === 'home' ? 'text-emerald-800 border-b-2 border-emerald-700 pb-1' : 'text-slate-600'}`}>{text.home}</button>
              <button onClick={() => setActiveTab('digital')} className={`transition hover:text-emerald-700 flex items-center gap-1 ${activeTab === 'digital' ? 'text-emerald-800 border-b-2 border-emerald-700 pb-1 font-bold' : 'text-slate-600'}`}>
                <Laptop size={15} /> {text.digital}
              </button>
              <button onClick={() => setActiveTab('problem')} className={`transition hover:text-emerald-700 flex items-center gap-1 ${activeTab === 'problem' ? 'text-red-700 border-b-2 border-red-600 pb-1 font-bold' : 'text-slate-600'}`}>
                <AlertCircle size={15} /> {text.reportProb}
              </button>
              <button onClick={() => setActiveTab('login')} className={`transition hover:text-emerald-700 flex items-center gap-1 ${activeTab === 'login' ? 'text-emerald-800 border-b-2 border-emerald-700 pb-1 font-bold' : 'text-slate-600'}`}>
                <LogIn size={15} /> {text.internalLogin}
              </button>
              
              {/* Language Switch Button */}
              <button 
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <Languages size={15} /> {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              <a href="#join" onClick={() => setActiveTab('home')} className="bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 border-b-2 border-red-600">
                {text.joinMove} <ArrowRight size={16} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="bg-red-50 text-red-800 px-2 py-1 rounded font-bold text-xs">
                {lang === 'en' ? 'हिन्दी' : 'En'}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700 p-2">
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
        

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded text-slate-700 font-semibold">{text.home}</button>
            <button onClick={() => { setActiveTab('digital'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded text-emerald-900 font-bold">💻 {text.digital}</button>
            <button onClick={() => { setActiveTab('problem'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded text-red-700 font-bold">⚠️ {text.reportProb}</button>
            <button onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded text-slate-700 font-semibold">🔐 {text.internalLogin}</button>
          </div>
        )}
      </header>

      {/* HOME TAB - Matching exact reference design with Kumaon/Garhwal Himalayan background aesthetic */}
      {activeTab === 'home' && (
        <>
          {/* Hero Section with Himalayan Kumaon/Garhwal backdrop */}
          <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white py-20 px-4 overflow-hidden border-b-4 border-red-600">
            {/* Subtle Himalayan Range background watermark effect */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px]"></div>
            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="bg-emerald-800/90 border border-red-500 text-emerald-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
                  <UKDFlagSymbol size={18} /> {text.heroBadge}
                </span>

                <div className="text-amber-400 font-black text-xl sm:text-2xl tracking-wide uppercase">
                  {text.slogan}
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-amber-100">
                  {text.heroHeading}
                </h1>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  {text.heroSub}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button onClick={() => setActiveTab('problem')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                    <AlertCircle size={18} /> {text.reportBtn}
                  </button>
                  <button onClick={() => setActiveTab('digital')} className="border border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-semibold px-6 py-3.5 rounded-xl transition text-center">
                    {text.statusBtn}
                  </button>
                </div>
              </div>

              {/* Reference Right Side Image Card (Elderly Kumauni/Garhwali Citizen representing Voice of Hills) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900/80 to-slate-900/90 backdrop-blur-md p-6 rounded-3xl border-2 border-amber-400/30 shadow-2xl text-center space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-inner border border-emerald-600">
                  <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-amber-300">UTTARAKHAND KUMAON & GARHWAL</span>
                    <CheckCircle size={20} className="text-emerald-400" />
                  </div>
                  <div className="p-6 bg-slate-900/60 space-y-3">
                    <div className="w-16 h-16 bg-amber-400/20 text-amber-300 rounded-full flex items-center justify-center mx-auto border border-amber-400/40 font-black text-xl">
                      UKD
                    </div>
                    <h4 className="text-lg font-bold text-white">समस्या हल हुई</h4>
                    <p className="text-xs text-slate-300">Verified grassroots resolution tracking across all hill & plain districts.</p>
                    <div className="inline-block bg-emerald-800/80 text-emerald-200 text-xs px-3 py-1 rounded-full font-mono">
                      UKD-2026-048
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          

          {/* Leaders Section */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{text.leadersTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-800 font-bold text-lg border-4 border-emerald-800 shadow-inner">
                  Indramani
                </div>
                <h3 className="font-bold text-lg text-slate-900">Indramani Badoni</h3>
                <p className="text-xs text-slate-500 font-medium">इन्द्रमणि बडोनी (Gandhi of Uttarakhand)</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-800 font-bold text-lg border-4 border-red-600 shadow-inner">
                  Kashi Singh
                </div>
                <h3 className="font-bold text-lg text-slate-900">Kashi Singh Airy</h3>
                <p className="text-xs text-slate-500 font-medium">काशी सिंह ऐरी (Veteran Leader)</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
                <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-800 font-bold text-lg border-4 border-emerald-800 shadow-inner">
                  Diwakar
                </div>
                <h3 className="font-bold text-lg text-slate-900">Diwakar Bhatt</h3>
                <p className="text-xs text-slate-500 font-medium">दिवाकर भट्ट (Founding Member)</p>
              </div>
            </div>
            
          

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-emerald-900 text-white p-8 rounded-3xl shadow-lg">
              <div>
                <div className="text-3xl font-black text-amber-400">1979</div>
                <div className="text-xs text-emerald-200 mt-1">स्थापना वर्ष</div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-400">13</div>
                <div className="text-xs text-emerald-200 mt-1">जिले में संगठन</div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-400">12</div>
                <div className="text-xs text-emerald-200 mt-1">सक्रिय कार्यकर्ता</div>
              </div>
              <div>
                <div className="text-3xl font-black text-amber-400">3</div>
                <div className="text-xs text-emerald-200 mt-1">विधानसभा क्षेत्र</div>
              </div>
            </div>
          </section>
          

          {/* Join Movement Section */}
          <section id="join" className="bg-emerald-950 text-white py-20 px-4 border-y-4 border-red-600">
            <div className="p-6 bg-white rounded-xl shadow-lg text-center my-4 border border-gray-100">
  <h3 className="text-xl font-bold text-gray-800 mb-2">Scan & Join UKD Movement</h3>
  <p className="text-sm text-gray-500 mb-4">Point your mobile camera here to open the registration portal instantly</p>
  <div className="flex justify-center p-3 bg-gray-50 rounded-lg inline-block border">
    <QRCodeSVG value="https://ukd-app.vercel.app/" size={160} />
  </div>
</div>
            <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-red-700 bg-red-100 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">{text.joinMove}</span>
                <h2 className="text-3xl font-black mt-3">Join Uttarakhand Kranti Dal</h2>
                <p className="text-slate-600 mt-2 text-sm">Be a part of shaping Uttarakhand's economic and administrative future.</p>
              </div>
              
          
              {joinSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle size={48} className="mx-auto text-emerald-600" />
                  <h3 className="text-2xl font-bold">Thank You for Joining UKD!</h3>
                  <p className="text-slate-600 text-sm">Your information has been recorded successfully.</p>
                  <button onClick={() => setJoinSubmitted(false)} className="mt-4 text-sm font-bold text-emerald-700 hover:underline">Register Another</button>
                </div>
              ) : (
                
               <form onSubmit={handleJoinSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                      <input 
                        type="text" required placeholder="Enter full name" 
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" required placeholder="10-digit mobile number" 
                        value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">District *</label>
                      <select required value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value, constituency: '', region: ''})} className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm">
                        <option value="">Select District</option>
                        {Object.keys(districtsAndConstituencies).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Constituency *</label>
                      <select required disabled={!formData.district} value={formData.constituency} onChange={(e) => setFormData({...formData, constituency: e.target.value, region: ''})} className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm">
                        <option value="">{formData.district ? 'Select Constituency' : 'Select District First'}</option>
                        {(districtsAndConstituencies[formData.district] || []).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Region / Area *</label>
                      <select required disabled={!formData.constituency} value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-sm">
                        <option value="">{formData.constituency ? 'Select Ward/Village' : 'Select Constituency First'}</option>
                        {(constituencyRegions[formData.constituency] || ["Central Ward", "Gram Panchayat"]).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition">
                    Submit Registration
                  </button>
                </form>
              )}
            </div>
          </section>
        </>
      )}

      {/* REPORT A PROBLEM TAB (समस्या दर्ज करें & स्थिति देखें) */}
      {activeTab === 'problem' && (
        <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-gradient-to-r from-red-950 to-emerald-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
            <span className="bg-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-red-400">
              Public Grievance Redressal
            </span>
            <h2 className="text-3xl font-black mt-3">समस्या दर्ज करें और स्थिति ट्रैक करें</h2>
            <p className="text-slate-300 text-sm mt-2">Submit your civic, water, road, or public infrastructure problem. Status is publicly viewable instantly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <AlertCircle className="text-red-600" /> New Problem Report
              </h3>
              {probSubmitted && (
                <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl text-xs font-bold border border-emerald-200">
                  ✅ Problem successfully filed! Recorded in the public ledger below.
                </div>
              )}
              <form onSubmit={handleProblemSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Your Name *</label>
                  <input type="text" required value={probForm.name} onChange={e => setProbForm({...probForm, name: e.target.value})} placeholder="Enter full name" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Address / Ward / Village *</label>
                  <input type="text" required value={probForm.address} onChange={e => setProbForm({...probForm, address: e.target.value})} placeholder="e.g. Lalkuan Ward 3" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number *</label>
                  <input type="tel" required value={probForm.phone} onChange={e => setProbForm({...probForm, phone: e.target.value})} placeholder="10-digit mobile number" className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Issue Description *</label>
                  <textarea required rows="3" value={probForm.issue} onChange={e => setProbForm({...probForm, issue: e.target.value})} placeholder="Describe your grievance or problem in detail..." className="w-full px-4 py-2.5 rounded-xl border text-sm"></textarea>
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2">
                  <Send size={16} /> Submit Grievance
                </button>
              </form>
            </div>

            {/* Public Status Tracker */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                <Clock className="text-emerald-700" /> Public Problem Status Tracker
              </h3>
              <p className="text-xs text-slate-500">Live feed of all reported grievances and their current resolution status.</p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {problems.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">{p.id}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${p.status.includes('Resolved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{p.issue}</p>
                    <div className="text-xs text-slate-500 flex justify-between">
                      <span>👤 {p.name} ({p.address})</span>
                      <span>📞 {p.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERNAL LOGIN PORTAL TAB */}
      {activeTab === 'login' && (
        <div className="py-16 max-w-md mx-auto px-4">
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-800 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow">
                <Lock size={22} className="text-amber-300" />
              </div>
              <h2 className="text-2xl font-black text-emerald-950">UKD Digital Command Portal</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">INTERNAL • AUTHORIZED ACCESS</p>
              <p className="text-xs text-slate-600">From leadership to the ground — everything connected. Demo sign-in to choose a role to explore its view.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert(`Logged in successfully as ${loginRole}!`); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email / Mobile *</label>
                <input type="text" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Sign in as (demo role):</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['District Coordinator', 'Central Worker', 'Booth Pramukh', 'Media Cell', 'General Secretary', 'Karyakarta'].map(role => (
                    <button 
                      type="button" 
                      key={role} 
                      onClick={() => setLoginRole(role)}
                      className={`p-2 rounded-xl border text-left font-semibold transition ${loginRole === role ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-950 text-white font-bold py-3.5 rounded-xl shadow transition text-sm">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL PORTAL TAB */}
      {activeTab === 'digital' && (
        <div className="py-12 max-w-7xl mx-auto px-4 space-y-8">
          <div className="bg-gradient-to-r from-emerald-950 to-red-950 rounded-3xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-black">UKD Digital Hub & Services</h2>
            <p className="text-slate-300 text-sm mt-2">Access verified regional documents, policy briefs, and district youth portals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg text-emerald-900">District Youth Cell</h3>
              <p className="text-xs text-slate-600 mt-2">Enroll in local skill development and organizing initiatives.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg text-red-700">Public Grievance Desk</h3>
              <p className="text-xs text-slate-600 mt-2">File complaints and track status in real-time.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-bold text-lg text-emerald-900">Policy Proposals</h3>
              <p className="text-xs text-slate-600 mt-2">Submit economic and ecological preservation ideas.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-emerald-950 text-slate-300 py-12 border-t-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <UKDFlagSymbol size={32} />
            <span className="text-white font-bold text-lg">Uttarakhand Kranti Dal</span>
          </div>
          <p className="text-sm text-center">{text.footerRights}</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-emerald-400 transition">{text.privacy}</a>
            <a href="#" className="hover:text-emerald-400 transition">{text.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}