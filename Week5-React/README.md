# Week 5 - React

React exercises for the Web Applications course, continued from Week 4.

## Exercises

- Custom hooks - media fetching moved to `useMedia` in `src/hooks/apiHooks.js`
- Forms - `useForm` in `src/hooks/formHooks.js`, `LoginForm` and `RegisterForm`
- Context - `UserContext` shares the logged in user, `ProtectedRoute` hides pages from guests
- File upload - `Upload` view sends the file to the Upload API and the info to the Media API

## Environment

The app reads the API addresses from `.env.local` (see `.env.example`).
The Media, Auth and Upload APIs are only available inside the Metropolia network
or through the Metropolia VPN.

## Commands

- `npm run dev` - start the development server
- `npm run build` - build the app into `dist`
- `npm run lint` - check the code with oxlint
