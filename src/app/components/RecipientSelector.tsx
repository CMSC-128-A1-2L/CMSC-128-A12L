"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Users, UserPlus, Mail } from "lucide-react";

interface Alumni {
  id: string;
  email: string;
  name: string;
}

interface RecipientSelectorProps {
  onRecipientsChange: (recipients: string[]) => void;
}

export default function RecipientSelector({ onRecipientsChange }: RecipientSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<'all' | 'specific' | 'manual'>('manual');
  const [emailInput, setEmailInput] = useState<string>("");
  const [emailChips, setEmailChips] = useState<{ id: string; email: string }[]>([]);
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [selectedAlumni, setSelectedAlumni] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedOption === 'all') {
      onRecipientsChange(allAlumni.map(alumni => alumni.email));
    } else if (selectedOption === 'specific') {
      onRecipientsChange(selectedAlumni);
    } else {
      onRecipientsChange(emailChips.map(chip => chip.email));
    }
  }, [selectedOption, allAlumni, selectedAlumni, emailChips, onRecipientsChange]);

  useEffect(() => {
    if (selectedOption === 'all' || selectedOption === 'specific') {
      fetchAlumni();
    }
  }, [selectedOption]);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users/alumni');
      if (!response.ok) {
        throw new Error('Failed to fetch alumni');
      }
      const data = await response.json();
      setAllAlumni(data);
      if (selectedOption === 'all') {
        setSelectedAlumni(data.map((alumni: Alumni) => alumni.email));
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = emailInput.trim();
      if (email && isValidEmail(email)) {
        setEmailChips([...emailChips, { id: Date.now().toString(), email }]);
        setEmailInput('');
      }
    }
  };

  const removeEmailChip = (id: string) => {
    setEmailChips(emailChips.filter(chip => chip.id !== id));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toggleAlumniSelection = (email: string) => {
    if (selectedOption === 'all') return; // Disable selection for "All Alumni"
    setSelectedAlumni(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const renderAlumniList = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-60 overflow-y-auto text-black">
        {loading ? (
          <p className="text-gray-700">Loading alumni...</p>
        ) : (
          <div className="space-y-2">
            {allAlumni.map((alumni) => (
              <div
                key={alumni.id}
                onClick={() => toggleAlumniSelection(alumni.email)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  (selectedOption === 'all' || selectedAlumni.includes(alumni.email))
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } border`}
              >
                <p className="font-medium">{alumni.name}</p>
                <p className="text-sm text-gray-600">{alumni.email}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {selectedOption === 'all' 
          ? `All alumni (${allAlumni.length} recipients)`
          : `Selected: ${selectedAlumni.length} alumni`}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Selection Options */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedOption('all')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            selectedOption === 'all'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-300 text-gray-700'
          }`}
        >
          <Users className="h-5 w-5" />
          All Alumni
        </button>
        <button
          onClick={() => setSelectedOption('specific')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            selectedOption === 'specific'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-300 text-gray-700'
          }`}
        >
          <UserPlus className="h-5 w-5" />
          Specific Alumni
        </button>
        <button
          onClick={() => setSelectedOption('manual')}
          className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            selectedOption === 'manual'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-300 text-gray-700'
          }`}
        >
          <Mail className="h-5 w-5" />
          Manual Input
        </button>
      </div>

      {/* Content based on selection */}
      {(selectedOption === 'all' || selectedOption === 'specific') && renderAlumniList()}

      {selectedOption === 'manual' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[42px]">
            {emailChips.map((chip) => (
              <div
                key={chip.id}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm"
              >
                <span>{chip.email}</span>
                <button
                  type="button"
                  onClick={() => removeEmailChip(chip.id)}
                  className="hover:text-blue-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={emailInput}
              onChange={handleEmailInput}
              onKeyDown={handleEmailKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 min-w-[200px]"
              placeholder="Type email and press Enter"
            />
          </div>
          <p className="text-sm text-gray-600">
            Added: {emailChips.length} emails
          </p>
        </div>
      )}
    </div>
  );
} 