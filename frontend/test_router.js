import { createMemoryRouter } from 'react-router-dom';
import { router } from './src/routes.jsx';

// createBrowserRouter is for DOM, but we can't run it in Node without JSDOM.
// Let's just inspect the routes array!
console.log(JSON.stringify(router.routes, null, 2));
