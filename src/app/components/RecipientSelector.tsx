"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Users, UserPlus, Mail, Search, CheckCircle, XCircle } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (selectedOption === 'all') {
      onRecipientsChange(filteredAlumni.map(alumni => alumni.email));
    } else if (selectedOption === 'specific') {
      onRecipientsChange(selectedAlumni);
    } else {
      onRecipientsChange(emailChips.map(chip => chip.email));
    }
  }, [selectedOption, allAlumni, selectedAlumni, emailChips, onRecipientsChange, searchQuery]);

  useEffect(() => {
    if (selectedOption === 'all' || selectedOption === 'specific') {
      fetchAlumni();
    }
  }, [selectedOption]);

  // Clear state when switching modes
  useEffect(() => {
    if (selectedOption !== 'specific') {
      setSelectedAlumni([]);
    }
    setSearchQuery('');
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
    if (selectedOption === 'all') return;
    setSelectedAlumni(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  // Select/Deselect all filtered alumni
  const handleSelectAll = () => {
    if (selectedOption === 'all') return;
    const filteredEmails = filteredAlumni.map(alumni => alumni.email);
    setSelectedAlumni(prev => {
      // If all filtered items are selected, deselect them
      const allFiltered = filteredEmails.every(email => prev.includes(email));
      if (allFiltered) {
        return prev.filter(email => !filteredEmails.includes(email));
      }
      // Otherwise, add all filtered items to selection
      return [...new Set([...prev, ...filteredEmails])];
    });
  };

  // Filter alumni based on search query
  const filteredAlumni = allAlumni.filter(alumni => 
    alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alumni.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if all filtered alumni are selected
  const areAllFilteredSelected = filteredAlumni.length > 0 && 
    filteredAlumni.every(alumni => selectedAlumni.includes(alumni.email));

  const renderAlumniList = () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="search"
          placeholder="Search alumni by name or email..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 max-h-60 overflow-y-auto text-black">
        {loading ? (
          <p className="text-gray-700">Loading alumni...</p>
        ) : filteredAlumni.length === 0 ? (
          <p className="text-gray-700 text-center py-4">No alumni found</p>
        ) : (
          <div className="space-y-2">
            {selectedOption === 'specific' && (
              <button
                onClick={handleSelectAll}
                className="w-full p-3 rounded-lg cursor-pointer transition-all duration-200 bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center gap-2 mb-4"
              >
                {areAllFilteredSelected ? (
                  <>
                    <XCircle className="h-5 w-5 text-gray-600" />
                    <span>Deselect All Filtered</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-gray-600" />
                    <span>Select All Filtered</span>
                  </>
                )}
              </button>
            )}
            {filteredAlumni.map((alumni) => (
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
          ? `Showing ${filteredAlumni.length} of ${allAlumni.length} alumni`
          : `Selected: ${selectedAlumni.length} alumni (showing ${filteredAlumni.length} filtered)`}
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