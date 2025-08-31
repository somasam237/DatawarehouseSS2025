// ProteinViewer.js
import React, { useEffect, useRef, useState } from 'react';

const ProteinViewer = ({ pdbId, cifData, width = '100%', height = '500px' }) => {
  const viewerContainerRef = useRef(null);
  const stageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let stage;
    setLoading(true);
    setError("");
    // Only try to load if cifData is a non-empty string
    if (!cifData || typeof cifData !== 'string' || cifData.trim() === "") {
      setLoading(false);
      setError("No CIF data provided");
      return;
    }
    const loadNGL = async () => {
      try {
        if (!window.NGL) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/ngl@latest/dist/ngl.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }
        stage = new window.NGL.Stage(viewerContainerRef.current, { backgroundColor: 'white' });
        stageRef.current = stage;
        const blob = new Blob([cifData], { type: 'text/plain' });
        await stage.loadFile(blob, { ext: 'cif' }).then((component) => {
          component.addRepresentation('cartoon', { color: 'chainid' });
          component.autoView();
        });
        setLoading(false);
      } catch (e) {
        setError("Failed to load structure");
        setLoading(false);
      }
    };
    loadNGL();
    return () => {
      if (stageRef.current) {
        stageRef.current.removeAllComponents();
        stageRef.current.dispose();
        stageRef.current = null;
      }
    };
  }, [cifData]);

  if (loading) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ width, height, color: 'red', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error}
      </div>
    );
  }

  return (
    <div
      ref={viewerContainerRef}
      style={{ width, height, border: '1px solid #ccc' }}
    />
  );
};

export default ProteinViewer;