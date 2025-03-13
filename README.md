# Cases App


## Prerequisites

Make sure you have [Bun](https://bun.sh) installed on your system. If not, you can install it by running:
Mac: 
```bash
curl -fsSL https://bun.sh/install | bash
``` 
Windows:
```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Getting Started

1. Clone the repository:
```bash
git clone <your-repository-url>
cd cases-app
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun dev
```

The application will be available at `http://localhost:3000`

## Running Tests

To run tests:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

## Project Structure

```
cases-app/
├── src/
│   ├── components/     # React components
│   ├── store/         # State management
│   ├── types/         # TypeScript type definitions
│   └── ...
├── public/            # Static assets
└── ...
```
