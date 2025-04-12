import React, { useState, useRef, useEffect } from "react";

interface CustomModalProps {
  modalId: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void; // Add the onSubmit prop
}

const CustomModal: React.FC<CustomModalProps> = ({
  modalId,
  title,
  isOpen,
  onClose,
  onSubmit, // Use onSubmit
}) => {
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [sponsorshipType, setSponsorshipType] = useState<string>("cash");
  const [specificItem, setSpecificItem] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close modal when `isOpen` changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal(); // Open the dialog
    } else {
      dialog?.close(); // Close the dialog
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ contactNo, email, sponsorshipType, specificItem });

    // Close the modal after submitting
    onSubmit(); // Call the parent's submit function

    // Optionally reset form data
    // setContactNo("");
    // setEmail("");
    // setSpecificItem("");
    // setSponsorshipType("cash");
  };

  return (
    <dialog ref={dialogRef} id={modalId} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="contactNo">
              Contact No.
            </label>
            <input
              type="text"
              id="contactNo"
              className="input input-bordered w-full mt-2"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold">Sponsorship Options</label>
            <div className="mt-2">
              <label className="mr-4">
                <input
                  type="radio"
                  name="sponsorshipType"
                  value="cash"
                  checked={sponsorshipType === "cash"}
                  onChange={() => setSponsorshipType("cash")}
                />
                Cash
              </label>

              {sponsorshipType === "cash" && (
                <div className="ml-4 mt-2">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="cashOption"
                      value="gcash"
                      onChange={() => setSpecificItem("gcash")}
                    />
                    GCash
                  </label>
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="cashOption"
                      value="bankTransfer"
                      onChange={() => setSpecificItem("bankTransfer")}
                    />
                    Bank Transfer
                  </label>
                </div>
              )}

              <label className="mr-4">
                <input
                  type="radio"
                  name="sponsorshipType"
                  value="specificItems"
                  checked={sponsorshipType === "specificItems"}
                  onChange={() => setSponsorshipType("specificItems")}
                />
                Specific Items
              </label>

              {sponsorshipType === "specificItems" && (
                <div className="mt-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter specific item(s)"
                    value={specificItem}
                    onChange={(e) => setSpecificItem(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-action">
            <button type="submit" className="btn">
              Submit
            </button>
            <button
              type="button"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CustomModal;
