"use client";
import { useState } from "react";

export default function CreateJL({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-1/2 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl mb-4 text-center">Create a new job post</h2>
        <form className="space-y-4">
          <label className="font-bold">Enter Job title:</label>
          <input
            type="text"
            className="w-full border rounded p-2 bg-gray-300"
          />
          <label className="font-bold">Enter location:</label>
          <input
            type="text"
            className="w-full border rounded p-2 bg-gray-300"
          />
          <label className="font-bold">Select job type:</label>
          <select className="w-full border rounded p-2 bg-gray-300">
            <option>Job type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>
          <label className="font-bold">Enter job specifications</label>
          <textarea
            rows={4}
            className="w-full border rounded p-2 bg-gray-300"
          />
          <button
            type="submit"
            className="bg-gray-400 text-white px-4 py-2 rounded mx-auto block"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
