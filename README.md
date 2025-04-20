# SafeRoute - AI-Powered Safety Routing App

SafeRoute is a web application that provides safety-optimized navigation between two points, prioritizing user safety over speed. It takes into account various safety factors such as crime zones, accident-prone areas, lighting conditions, and time of day.

## Features

- Interactive map interface with source and destination input
- Safety-optimized route suggestions
- Color-coded routes based on safety scores
- Real-time risk alerts
- User-crowdsourced danger reports
- Time-aware safety calculations

## Tech Stack

- React.js
- Leaflet.js for maps
- Styled Components for styling
- Firebase (optional) for backend and data storage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
SafeRoute/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MapView.jsx
│   │   ├── RouteInput.jsx
│   │   ├── SafetyLegend.jsx
│   │   └── AlertPopup.jsx
│   ├── data/
│   │   ├── crimeZones.json
│   │   ├── accidentZones.json
│   │   ├── lightingZones.json
│   │   ├── cctvZones.json
│   │   └── userReports.json
│   ├── utils/
│   │   └── scoreCalculator.js
│   ├── App.js
│   └── index.js
├── README.md
├── package.json
└── .env
```

## Safety Score Calculation

The safety score is calculated using the following formula:
```js
safetyScore = 
    (crimeCount * 5) + 
    (accidentCount * 4) + 
    (unlitCount * 3) -
    (cctvCoverage * 2)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 