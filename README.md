# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment

### Required environment variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `PORT` — server port, usually `4000`
- `VITE_API_BASE` — frontend API base path, for example `/auth` if the backend is served from the same host or `https://api.example.com/auth` if using a separate backend host

### Backend deployment
1. Create `.env` in `backend/server/` from `backend/server/.env.example`.
2. Set `MONGODB_URI`, `JWT_SECRET`, and `PORT`.
3. Install dependencies in the repo root or `backend/server`.
4. Start the server with `npm run start:server`.

### Frontend deployment
1. Set `VITE_API_BASE` in your frontend environment if the backend is hosted separately.
2. Build the app:
   - `cd frontend`
   - `npm install`
   - `npm run build`
3. Deploy `frontend/dist` to your static hosting provider.

### Same-host deployment
If you serve frontend and backend from the same host, the backend now serves `frontend/dist` in production. In that case, `VITE_API_BASE` can remain unset and the app will use relative `/auth` requests.

### Notes
- `.env` files are ignored by Git.
- Use `.env.example` as a template only.
