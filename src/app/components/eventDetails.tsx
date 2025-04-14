import React, { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import CustomModal from "./eventSponsorshipRequestDisplay";

interface EventDetailsProps {
  _id: string;
  index: number;
  title: string;
  date: string;
  organizer: string;
  location: string;
  description?: string;
  contactInfo?: string;
  isOpen: boolean;
  onClose: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  date,
  organizer,
  contactInfo,
  location,
  description,
  isOpen,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  const [isSponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [showConfirmCloseModal, setShowConfirmCloseModal] = useState(false);
  const detailsModalRef = useRef<HTMLDialogElement>(null);
  const sponsorModalRef = useRef<HTMLDialogElement>(null);

  // Automatically open/close the details modal when `isOpen` changes
  useEffect(() => {
    if (isOpen) {
      detailsModalRef.current?.showModal();
    } else {
      detailsModalRef.current?.close();
    }
  }, [isOpen]);

  // Open/close sponsor modal based on toggle
  useEffect(() => {
    if (isSponsorModalOpen) {
      sponsorModalRef.current?.showModal();
    } else {
      sponsorModalRef.current?.close();
    }
  }, [isSponsorModalOpen]);

  const handleSponsorToggle = () => {
    if (isSponsorModalOpen) {
      setShowConfirmCloseModal(true);
    } else {
      setSponsorModalOpen(true);
    }
  };

  const handleCloseDetails = () => {
    onClose(); // parent manages modal state
  };

  const handleSponsorSubmit = () => {
    setSponsorModalOpen(true); // Keep the toggle on if the user submits
    onClose();
  };

  const handleSponsorCancel = () => {
    setSponsorModalOpen(false); // Set toggle off if the user cancels
  };

  return (
    <>
      {/* Event Details Modal */}
      <dialog ref={detailsModalRef} className="modal">
        <div className="modal-box rounded-3xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleCloseDetails}
            >
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mt-4">{title}</h3>

          <div className="pt-4">
            <p className="font-bold text-left text-gray-700">Date</p>
            <p className="px-2 pb-2">{date}</p>

            <p className="font-bold text-left text-gray-700">Organizer</p>
            <p className="px-2 pb-2">{organizer}</p>

            <p className="font-bold text-left text-gray-700">Contact Info</p>
            <p className="px-2 pb-2">{contactInfo}</p>

            <p className="font-bold text-left text-gray-700">Location</p>
            <p className="px-2 pb-2">{location}</p>

            <p className="font-bold text-left text-gray-700">Description</p>
            <p className="px-2 pb-2">{description}</p>

            <div className="flex flex-col gap-2 pt-6">
              <div className="flex items-center justify-between p-4 rounded-lg w-full">
                <span className="text-black text-base font-medium">
                  Sponsor the event
                </span>
                <input
                  type="checkbox"
                  checked={isSponsorModalOpen}
                  onChange={handleSponsorToggle}
                  className="toggle bg-[#0c0051] border-[#ffffff] checked:bg-[#0c0051] checked:border-[#0f1423]"
                />
              </div>

              <div className="flex flex-row gap-2">
                <button onClick={onEditClick} className="btn btn-dash flex-grow">
                  Edit
                </button>
                <button onClick={onDeleteClick} className="btn btn-dash btn-error btn-sqr">
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>

      {/* Sponsor Modal */}
      {isSponsorModalOpen && (
        <div className="modal-box">
          <CustomModal
            modalId="custom_modal"
            title="Sponsorship Request"
            isOpen={isSponsorModalOpen}
            onClose={handleSponsorCancel} // Handle cancellation in the parent
            onSubmit={handleSponsorSubmit} // Handle submit in the parent
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={handleSponsorCancel}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Close Modal */}
      {showConfirmCloseModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Stop Sponsoring?</h3>
            <p>Are you sure you want to stop sponsoring this event?</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={() => {
                  setSponsorModalOpen(false);
                  setShowConfirmCloseModal(false);
                }}
              >
                Yes, Stop
              </button>
              <button className="btn" onClick={() => setShowConfirmCloseModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default EventDetails;
