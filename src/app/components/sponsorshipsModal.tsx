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
            <p className="font-bold text-left text-gray-700">Contact Details</p>
            <div className="flex">
              <p className="px-2 font-bold text-gray-700">Contact Number:</p> 
              <p>Lorem Ipsum</p>
            </div>
            <div className="flex">
              <p className="px-2 font-bold text-gray-700">Email:</p> 
              <p className="pb-2">Lorem Ipsum</p>
            </div>

            <p className="font-bold text-left text-gray-700">Sponsorship Options</p>
            <li className="px-2"> Lorem Ipsum </li>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default SponsorDetails;
