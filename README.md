# Space Biology Navigator

A React-based web application for exploring NASA's space biology research. This project allows users to search and explore decades of space biology experiments using an organism-centric approach.

## Features

- **Organism-Centric Search**: Search by organism name and discover related experiments
- **Smart Filtering**: Filter experiments by conditions like microgravity, radiation, etc.
- **Research Papers**: Browse and explore scientific publications
- **Interactive Dashboard**: Visual exploration of organisms and papers
- **Mock Data**: Currently uses mock data for demonstration purposes

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Organism-centric-navigator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main page components
├── lib/                # Utilities and data
│   ├── types.ts        # TypeScript type definitions
│   └── mockData.ts     # Mock data for development
└── assets/             # Static assets
```

## Data Structure

The application currently uses mock data with the following main types:

- **Organisms**: Space biology model organisms
- **Papers**: Research publications
- **Experiments**: Experimental data linking organisms and papers
- **Conditions**: Environmental conditions studied

## Contributing

This project was created for the NASA Space Apps Challenge 2025 by Team Astra Innovators.

## License

This project is open source and available under the [MIT License](LICENSE).

## Team

Created by **Astra Innovators** for the NASA Space Apps Challenge 2025.
