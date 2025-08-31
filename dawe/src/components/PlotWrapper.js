 
import React from 'react';


let Plot = null;
try {
  const PlotlyComponent = require('react-plotly.js');
  Plot = PlotlyComponent.default || PlotlyComponent;
} catch (error) {
  console.warn('Plotly.js not available:', error);
}

const PlotWrapper = ({ data, layout, config, style, ...props }) => {
  if (!Plot) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        border: '1px dashed #ccc', 
        borderRadius: '4px',
        color: '#666',
        ...style 
      }}>
        <p>📊 Chart visualization not available</p>
        <p style={{ fontSize: '12px' }}>Plotly.js component failed to load</p>
      </div>
    );
  }

  return (
    <Plot
      data={data || []}
      layout={{
        autosize: true,
        ...layout,
      }}
      config={{
        responsive: true,
        displayModeBar: false,
        ...config,
      }}
      style={{
        width: '100%',
        height: '400px',
        ...style,
      }}
      {...props}
    />
  );
};

export default PlotWrapper;
