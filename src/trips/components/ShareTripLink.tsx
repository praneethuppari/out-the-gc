import { useState } from 'react';

type ShareTripLinkProps = {
  joinToken: string;
};

export function ShareTripLink({ joinToken }: ShareTripLinkProps) {
  const [copied, setCopied] = useState(false);
  const joinUrl = `${window.location.origin}/join/${joinToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div
      data-testid="share-trip-link"
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Share Trip</h3>
          <p className="text-sm text-gray-400">Invite friends to join your trip</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={joinUrl}
          readOnly
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <button
          onClick={handleCopy}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400'
          }`}
        >
          {copied ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

