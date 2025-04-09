"use client";
import React from "react";

interface SponsorDetailsProps {
  onClose: () => void;
}

const SponsorDetails: React.FC<SponsorDetailsProps> = ({
  onClose,
}) => {
  return (
    <dialog id="sponsor_details_modal" className="modal">
      <div className="modal-box rounded-3xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mt-4 text-center">Sponsorship Details</h3>

        <div className="pt-4">
            <p className="font-bold text-left text-gray-700">Contact Person</p>
            <p className="px-2 pb-2">Lorem Ipsum</p>

            <p className="font-bold text-left text-gray-700">Items to Donate</p>
            <li className="px-2"> Cash </li>
            <li className="px-2"> Laptop </li>

            <p className="font-bold text-left text-gray-700">Method of Payment</p>
            <li className="px-2"> Gcash </li>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default SponsorDetails;
