import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // optional icon from lucide-react (or use any icon library)

const StudentProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setTimeout(() => {
                setUserData(JSON.parse(storedUser));
                setLoading(false);
            }, 1000);
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="p-4 mt-20 max-w-5xl mx-auto md:ml-0">
            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Profile
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    {loading ? (
                        <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                    ) : (
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-400"
                        />
                    )}

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base w-full">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <SkeletonField key={index} />
                            ))
                        ) : (
                            <>
                                <ProfileField label="Name" value={userData?.name} />
                                <ProfileField label="Email" value={userData?.email} />
                                <ProfileField label="Phone" value={userData?.phone} />
                                <ProfileField label="Institute" value={userData?.instituteName} />
                                <ProfileField label="Batch Name" value={userData?.batch?.batchName} />

                                <div className="flex justify-center mt-4 w-full">
                                    <button
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 rounded text-red-600 font-semibold"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, value }) => (
    <div className="bg-gray-100 rounded p-3 w-full">
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="font-semibold text-black">{value || "N/A"}</p>
    </div>
);

const SkeletonField = () => (
    <div className="bg-gray-100 rounded p-3 w-full animate-pulse">
        <div className="h-4 bg-gray-300 rounded mb-2 w-1/3"></div>
        <div className="h-5 bg-gray-300 rounded w-2/3"></div>
    </div>
);

export default StudentProfile;
