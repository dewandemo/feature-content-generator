# Feature Content Generator

This project is a Next.js application using TypeScript and Tailwind CSS. It leverages various Radix UI components and other modern libraries.

## Getting Started

### 1. Install Dependencies

This project uses `pnpm` as the preferred package manager (see `pnpm-lock.yaml`). If you don't have pnpm installed, you can install it globally:

```sh
npm install -g pnpm
```

Then, install the dependencies:

```sh
pnpm install
```

> **Note:** If you use `npm install` and encounter dependency conflicts (e.g., with `date-fns` and `react-day-picker`), update your `date-fns` version in `package.json` to `^3.0.0` or use pnpm for smoother dependency resolution.

### 2. Run the Development Server

```sh
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production

```sh
pnpm build
```

### 4. Start the Production Server

```sh
pnpm start
```

## Troubleshooting

- If you see dependency errors with npm, try using pnpm or update conflicting dependencies as described above.
- For more scripts, see the `scripts` section in `package.json`.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Radix UI

## License

This project is private.
