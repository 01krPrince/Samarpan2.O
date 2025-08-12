import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  GraduationCap,
  User2,
  Mail,
  Phone,
  School2,
  Users,
  Calendar,
  BookOpen,
  MapPin,
  BadgeCheck,
  Linkedin,
  Github,
  Star,
  ArrowRightCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Edit3,
  FileText,
  CheckCircle,
} from "lucide-react";
import profilePhoto from "../../../../assets/profilepic.png";
import EmailVerificationModal from "./EmailVerificationModal";

const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-4 p-3 rounded-xl bg-white hover:bg-gray-50 transition shadow-sm">
    <Icon size={20} className="text-indigo-600 mt-1" />
    <div className="flex-1">
      <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-all">{value || "N/A"}</p>
    </div>
  </div>
);

const SkeletonField = () => (
  <div className="flex items-center gap-4 p-3 animate-pulse rounded-xl bg-white/60">
    <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
      <div className="h-4 w-40 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const staticProjects = [
  {
    title: "Smart Attendance System",
    description: "A face-recognition based attendance app for colleges.",
    tech: ["React", "Node.js", "OpenCV"],
    status: "Reviewed",
  },
  {
    title: "E-Learning Portal",
    description: "A platform for online study materials and quizzes.",
    tech: ["Next.js", "MongoDB"],
    status: "Pending",
  },
  {
    title: "Portfolio Website",
    description: "Personal portfolio with resume and project showcase.",
    tech: ["React", "Tailwind CSS"],
    status: "Live",
  },
];

export default function StudentProfile({ onCreateResume }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("personal");

  // Manage Email Verification Modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("idle"); // idle, loading, error, success
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setTimeout(() => {
        setUserData(JSON.parse(storedUser));
        setLoading(false);
      }, 800);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const resendOTP = () => {
    setResendCooldown(30);
    setVerificationStatus("idle");
    setError("");
    // Replace with your actual API call to resend OTP
  };

  const verifyOtpHandler = (otp) => {
    setVerificationStatus("loading");
    setError("");
    // Replace this with your actual API call to verify OTP
    setTimeout(() => {
      if (otp === "123456") {
        setVerificationStatus("success");
        const updated = { ...userData, isEmailVerified: true };
        setUserData(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setTimeout(() => setShowVerifyModal(false), 1200);
      } else {
        setVerificationStatus("error");
        setError("Invalid OTP. Please try again.");
      }
    }, 1300);
  };

  const coachingInstitute =
    !loading && userData?.instituteName?.toLowerCase() === "codingage"
      ? "Coding Age"
      : userData?.instituteName || "N/A";

  const batchDate =
    !loading && userData?.batch?.date
      ? new Date(userData.batch.date).toLocaleDateString()
      : null;

  const staticAcademic = [
    { label: "Currently Pursuing", value: "B.Tech", icon: GraduationCap },
    { label: "Field", value: "Computer Science & Engineering", icon: BookOpen },
    { label: "Year", value: "4th Year", icon: Calendar },
    { label: "School/College", value: "ABC College of Engineering", icon: School2 },
    { label: "Enrollment No", value: "ENR2025X123", icon: BadgeCheck },
    { label: "Course Completion Year", value: "2026", icon: Star },
    { label: "Specification", value: "Full Stack Developer", icon: ArrowRightCircle },
  ];

  const skills = [
    "React.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Tailwind CSS",
    "REST APIs",
    "Git & GitHub",
  ];

  const toggleSection = (section) => setOpenSection(section);

  const isEmailVerified = userData?.isEmailVerified;

const [isOtpSent, setIsOtpSent] = useState(false);
const token = localStorage.getItem("token");

async function handleOpenVerifyModal() {
  try {
    console.log("Email to send OTP:", userData.email);

    const response = await fetch(
      `http://localhost:8080/api/v1/otp/send-otp?email=${encodeURIComponent(userData.email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Check response content type safely
    let data;
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    console.log("Server Response:", data);

    setIsOtpSent(true);
    setShowVerifyModal(true);
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    alert("Failed to send OTP: " + error.message);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <EmailVerificationModal
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        email={userData?.email}
        onVerify={verifyOtpHandler}
        loading={verificationStatus === "loading"}
        status={verificationStatus === "success" ? "success" : undefined}
        error={verificationStatus === "error" ? error : undefined}
        resendOTP={resendOTP}
        resendDisabled={resendCooldown > 0}
      />

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8 p-8">
          {/* Sidebar */}
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow overflow-hidden">
              <img src={profilePhoto} alt="Profile" className="object-cover w-full h-full" />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {loading ? (
                <span className="animate-pulse bg-gray-200 rounded w-32 h-6 inline-block" />
              ) : (
                userData?.name || "Student Name"
              )}
            </h2>

            <p className="text-gray-600 italic text-sm mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-100 rounded w-40 h-4 inline-block" />
              ) : (
                "Focused on learning and growing."
              )}
            </p>

            <div className="flex gap-4 mt-4">
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-700 hover:text-black">
                <Github size={20} />
              </a>
            </div>

            {/* Email Verification Button */}
            {!loading && userData?.email && (
              <div className="flex flex-col items-center w-full mt-4 cursor-pointer">
                <button
                  onClick={() => handleOpenVerifyModal()}
                  disabled={isEmailVerified}
                  className={`w-full flex items-center gap-2 justify-center px-5 py-2 rounded-lg font-semibold transition shadow mb-2 cursor-pointer ${
                    isEmailVerified
                      ? "bg-green-50 border border-green-200 text-green-700 cursor-not-allowed"
                      : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-200 animate-pulse"
                  }`}
                  type="button"
                >
                  {isEmailVerified ? (
                    <>
                      <CheckCircle size={18} className="text-green-600" /> Email Verified
                    </>
                  ) : (
                    <>
                      <Mail size={18} /> Verify Account
                    </>
                  )}
                </button>
                {!isEmailVerified && (
                  <span className="text-[11px] text-yellow-600">Required for full access</span>
                )}
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={handleEditProfile}
              className="mt-6 inline-flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-indigo-700 font-semibold px-5 py-2 rounded-lg shadow transition"
              type="button"
            >
              <Edit3 size={18} /> Edit Profile
            </button>

            {/* Create Resume Button */}
            <button
              onClick={onCreateResume}
              className="mt-3 inline-flex items-center cursor-pointer gap-2 text-white font-semibold px-5 py-2 rounded-lg shadow transition bg-gray-800 hover:bg-gray-900"
              type="button"
            >
              <FileText size={18} /> Create Resume
            </button>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3 space-y-6">
            {/* Personal Info Accordion */}
            <section>
              <button
                className="w-full flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900 mb-3 px-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleSection("personal")}
                aria-expanded={openSection === "personal"}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <User2 size={18} /> Personal Information
                </span>
                {openSection === "personal" ? <ChevronDown /> : <ChevronRight />}
              </button>
              {openSection === "personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => <SkeletonField key={idx} />)
                  ) : (
                    <>
                      <ProfileField label="Name" value={userData?.name} icon={User2} />
                      <ProfileField label="Email" value={userData?.email} icon={Mail} />
                      <ProfileField label="Phone" value={userData?.phone} icon={Phone} />
                      <ProfileField label="Address" value="XYZ Hostel, Campus Road, City" icon={MapPin} />
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Academic Info Accordion */}
            <section>
              <button
                className="w-full flex items-center cursor-pointer justify-between text-lg font-semibold text-gray-900 mb-3 px-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleSection("academic")}
                aria-expanded={openSection === "academic"}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={18} /> Academic Information
                </span>
                {openSection === "academic" ? <ChevronDown /> : <ChevronRight />}
              </button>
              {openSection === "academic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {staticAcademic.map((field, idx) => (
                    <ProfileField key={idx} label={field.label} value={field.value} icon={field.icon} />
                  ))}
                  {!loading && (
                    <>
                      <ProfileField label="Coaching Institute" value={coachingInstitute} icon={School2} />
                      <ProfileField label="Batch Name" value={userData?.batch?.batchName} icon={Users} />
                      <ProfileField label="Started From" value={batchDate} icon={Calendar} />
                    </>
                  )}
                </div>
              )}
            </section>

            {/* Skills Accordion */}
            <section>
              <button
                className="w-full flex items-center cursor-pointer justify-between text-lg font-semibold text-gray-900 mb-3 px-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleSection("skills")}
                aria-expanded={openSection === "skills"}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={18} /> Skills Acquired
                </span>
                {openSection === "skills" ? <ChevronDown /> : <ChevronRight />}
              </button>
              {openSection === "skills" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-indigo-800 font-medium shadow-sm"
                    >
                      <Star size={16} className="text-indigo-400" /> {skill}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Projects Accordion */}
            <section>
              <button
                className="w-full flex items-center cursor-pointer justify-between text-lg font-semibold text-gray-900 mb-3 px-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleSection("projects")}
                aria-expanded={openSection === "projects"}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={18} /> Projects Submitted
                </span>
                {openSection === "projects" ? <ChevronDown /> : <ChevronRight />}
              </button>
              {openSection === "projects" && (
                <div className="space-y-4 mb-2">
                  {staticProjects.map((proj, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-md font-semibold text-gray-900">{proj.title}</h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-bold ${
                            proj.status === "Live"
                              ? "bg-green-100 text-green-800"
                              : proj.status === "Reviewed"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {proj.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-sm my-4">
              ⚠️ <strong>Disclaimer:</strong> This page is currently under construction. Around 90% of
              the data is static and shown for demo purposes only. Updates coming soon!
            </div>

            {/* Logout */}
            {!loading && (
              <div className="pt-4 text-right">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center cursor-pointer gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2 rounded-lg shadow"
                  type="button"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
