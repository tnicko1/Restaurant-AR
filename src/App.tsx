/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Initializing AR Engine...');

  useEffect(() => {
    const checkEnvironment = async () => {
      // Small delay just to let the splash screen render smoothly
      await new Promise(r => setTimeout(r, 600));

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      
      // Feature detect WebXR
      if (navigator.xr && navigator.xr.isSessionSupported) {
        setStatus('Checking AR capabilities...');
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-ar');
          if (supported || isIOS) {
            setStatus('Launching Advanced AR...');
            window.location.replace('./advanced-ar.html');
          } else {
            setStatus('Launching Universal AR...');
            window.location.replace('./mind-ar-fallback.html');
          }
        } catch (e) {
          console.error(e);
          setStatus('Launching Universal AR...');
          window.location.replace('./mind-ar-fallback.html');
        }
      } else {
        // Fallback or iOS Quick Look detection
        if (isIOS) {
           // iOS supports AR Quick Look via model-viewer without WebXR explicitly exposed
           setStatus('Launching Advanced AR...');
           window.location.replace('./advanced-ar.html');
        } else {
           setStatus('Launching Universal AR...');
           window.location.replace('./mind-ar-fallback.html');
        }
      }
    };

    checkEnvironment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-zinc-950 text-white font-sans p-6 text-center">
      <div className="w-20 h-20 bg-zinc-900 rounded-2xl animate-pulse flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(52,211,153,0.1)]">
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-emerald-400">
           <path d="M5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm4 16H5v-4H3v4c0 1.1.9 2 2 2h4v-2zm12-4v4h-4v2h4c1.1 0 2-.9 2-2v-4h-2zm-4-14h4v4h2V5c0-1.1-.9-2-2-2h-4v2zm-2.05 10c0 2.21-1.78 3.99-3.95 3.99-2.18 0-3.95-1.78-3.95-4S8.82 11 11 11c2.17 0 3.95 1.79 3.95 4z"></path>
        </svg>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">Instant WebAR Menu</h1>
      <p className="text-zinc-500 font-medium text-sm">{status}</p>
    </div>
  );
}
