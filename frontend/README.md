## Getting Started

First, run the development server:

```bash
pnpm dev
```

## Fonts
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Frontend Tech Stack:
- package manager: pnpm
- Framework: React + NextJs
- CSS: Tailwind
- Linter: Biome 


### File structure:
On frontend editable files are stored inside ```src``` folder consisting of:
- ```app``` used only for basic routing in nextJS, with view specific folders that only import views defined in features folder

- ```features```: view-specific components, utils and hooks with view.tsx file acting as code for entire page

- ```lib```

- ```ui```: components used across entirety of the app: buttons, switchers, other ui from external libraries
