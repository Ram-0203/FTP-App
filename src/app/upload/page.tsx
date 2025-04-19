'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    setIsLoading(true);
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];

      const payload = {
        CustomerName: name,
        CustomerEmail: email,
        FileName: file.name,
        FileContent: base64String,
        Password: password,
      };

      console.log(payload);

      try {
        const response = await fetch("https://u3ry4ziael.execute-api.eu-north-1.amazonaws.com/createFTP", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          setSuccessMessage(`✅ Uploaded! Share link: ${result.ShareLink || 'Check email or system for delivery.'}`);
          setName('');
          setEmail('');
          setPassword('');
          setFiles(null);
        } else {
          console.error("Upload failed:", result);
          alert("Upload failed: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Request error:", err);
        alert("An error occurred while uploading the file.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📤 Upload Files
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Customer Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 cursor-pointer hover:border-blue-400 transition-colors text-center"
            >
              <CloudArrowUpIcon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-gray-600 font-medium">Click to upload or drag & drop</span>
              <span className="text-sm text-gray-400">PDFs, images, docs, etc.</span>
              <input
                id="file-upload"
                type="file"
                multiple={false}
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
                required
              />
            </label>

            {files && (
              <ul className="mt-3 text-sm text-gray-700 list-disc list-inside space-y-1">
                {Array.from(files).map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2">
            <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Set a password for downloads"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
            ) : null}
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 text-sm rounded-lg">
            {successMessage}
          </div>
        )}
      </main>
    </div>
  );
}
