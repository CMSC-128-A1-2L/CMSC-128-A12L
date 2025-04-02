import { style } from "framer-motion/client";
import { X } from "lucide-react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRole: string;
    onSelectRole: (role: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, selectedRole, onSelectRole }) => {
    if (!isOpen) return null; // Don't render if closed

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/20"
            onClick={onClose} // Close when clicking outside
        >
            {/* Modal Content */}
            <div 
                className="bg-white p-6 rounded-lg shadow-lg w-80 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black">Filter by Role</h2>
                    <button onClick={onClose}>
                        <X size={20} color="black"/>
                    </button>
                </div>

                {/* Role Filter Options */}
                <div className="space-y-2">
                    {["All", "alumni", "alumniadmin", "student"].map((role) => (
                        <button
                            key={role}
                            className={`btn block w-full p-2 rounded-md bg-[#0C0051] text-white hover:bg-[#12006A] ${
                                selectedRole === role ? "bg-[#0C0051] text-white" : "bg-[#0C0051]"
                            }` } 
                            onClick={() => {
                                onSelectRole(role);
                                onClose(); // Close modal after selection
                            }} style={{ fontFamily: "Montserrat, sans-serif", fontSize: "15px", cursor: "pointer"}}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
