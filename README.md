# Joke CLI Generator

A command-line interface for fetching random jokes and rating them. Compatible with Bun, Node.js, and multiple package managers.

## Installation

Choose your preferred package manager:

### Using Bun
```bash
bun install -g joke-cli-generator
```

### Using npm
```bash
npm install -g joke-cli-generator
```

### Using yarn
```bash
yarn global add joke-cli-generator
```

### Using pnpm
```bash
pnpm add -g joke-cli-generator
```

## Usage

### Get a Random Joke
```bash
joke get
```

### View Rating History
```bash
joke ratings
```

### Help
```bash
joke --help
```

## Features

- Fetch random jokes from an API
- Rate jokes from 1-10
- Save ratings with timestamp and user information
- View rating history
- Calculate average ratings
- Beautiful CLI interface with colors and formatting
- Compatible with multiple package managers (Bun, npm, yarn, pnpm)
- Built with modern JavaScript features

## Development

### Prerequisites

- Bun >= 1.0.0 or Node.js >= 18.0.0
- npm, yarn, or pnpm (optional)

### Setup for Development

1. Clone the repository:
```bash
git clone https://github.com/Zaid-maker/joke-cli-generator.git
cd joke-cli-generator
```

2. Install dependencies (choose one):
```bash
# Using Bun
bun install

# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. Link the package locally:
```bash
# Using Bun
bun link

# Using npm
npm link

# Using yarn
yarn link

# Using pnpm
pnpm link
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.