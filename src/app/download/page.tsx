'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import { LockClosedIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function DownloadPage() {
  const [ref, setRef] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) setRef(refParam);
  }, []);

  const handleDownload = async () => {
    if (!ref || !password) {
      setErrorMsg('Both ref and password are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setDownloaded(false);

    try {
      const res = await fetch('https://2vyfrw5y6l.execute-api.eu-north-1.amazonaws.com/downloadFTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, password }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok || !data.url || !data.fileName) {
        throw new Error(data.error || 'Invalid credentials or missing file.');
      }

      // ✅ Trigger file download using a link
      const link = document.createElement('a');
      link.href = data.url;
      link.download = data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloaded(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Download failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-md mx-auto mt-16 bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🔐 Secure File Download
        </h2>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-medium">Reference ID</label>
          <input
            type="text"
            value={ref}
            readOnly
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded px-3 py-2 mb-4">
          <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600 mb-4">{errorMsg}</p>
        )}

        <button
          onClick={handleDownload}
          disabled={loading}
          className={`flex items-center justify-center w-full ${
            loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
          } text-white font-semibold py-2 rounded-lg transition space-x-2`}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download Files</span>
            </>
          )}
        </button>

        {downloaded && (
          <p className="text-sm text-green-700 mt-4 text-center">
            ✅ Download started at {new Date().toLocaleString()}
          </p>
        )}
      </main>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
