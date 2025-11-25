import { useState } from 'react';
import { detectPlatform, setPlatformOverride } from '../config/ui.config';

export function PlatformSwitcher() {
  const [currentPlatform, setCurrentPlatform] = useState(detectPlatform());
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleSwitch = (platform: 'gpt' | 'web' | 'mobile') => {
    setPlatformOverride(platform);
    setCurrentPlatform(platform);
  };

  const handleReset = () => {
    setPlatformOverride(null);
  };

  const platformEmojis = {
    gpt: '🤖',
    web: '💻',
    mobile: '📱',
  };

  const platformNames = {
    gpt: 'GPT Mode (Text)',
    web: 'Web Mode (Buttons)',
    mobile: 'Mobile Mode (Hybrid)',
  };

  return (
    <div className="platform-switcher">
      {/* Toggle button */}
      <button
        onClick={() => setShowSwitcher(!showSwitcher)}
        className="platform-toggle"
        title="Switch Platform Mode"
      >
        {platformEmojis[currentPlatform]} {platformNames[currentPlatform]}
      </button>

      {/* Switcher panel */}
      {showSwitcher && (
        <div className="platform-panel">
          <h3>🔧 Platform Mode</h3>
          <p className="text-sm text-gray-600 mb-4">
            Test different platform experiences
          </p>

          <div className="platform-options">
            {(['gpt', 'web', 'mobile'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => handleSwitch(platform)}
                className={`platform-option ${
                  currentPlatform === platform ? 'active' : ''
                }`}
              >
                <span className="text-3xl">{platformEmojis[platform]}</span>
                <span className="font-medium">{platformNames[platform]}</span>
                {currentPlatform === platform && (
                  <span className="badge">Current</span>
                )}
              </button>
            ))}
          </div>

          <button onClick={handleReset} className="reset-button">
            🔄 Reset to Auto-Detect
          </button>

          <div className="platform-info">
            <h4>Current Configuration:</h4>
            <ul className="text-sm">
              <li>
                <strong>Platform:</strong> {currentPlatform}
              </li>
              <li>
                <strong>Display Mode:</strong>{' '}
                {currentPlatform === 'gpt'
                  ? 'Text (numbered lists)'
                  : currentPlatform === 'web'
                  ? 'Buttons (clickable)'
                  : 'Hybrid (buttons + voice)'}
              </li>
              <li>
                <strong>Features:</strong>{' '}
                {currentPlatform === 'gpt'
                  ? 'Basic text only'
                  : currentPlatform === 'web'
                  ? 'All features enabled'
                  : 'Mobile-optimized'}
              </li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .platform-switcher {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }

        .platform-toggle {
          background: white;
          border: 2px solid #e5e7eb;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .platform-toggle:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .platform-panel {
          position: absolute;
          top: 50px;
          right: 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          width: 320px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .platform-panel h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .platform-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .platform-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .platform-option:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .platform-option.active {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .badge {
          margin-left: auto;
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .reset-button {
          width: 100%;
          padding: 10px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .reset-button:hover {
          background: #e5e7eb;
        }

        .platform-info {
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
        }

        .platform-info h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .platform-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .platform-info li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}

