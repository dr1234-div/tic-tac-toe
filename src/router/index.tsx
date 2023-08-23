import React from 'react';
import App from '../App';
import GoBang from '../GoBang';
import WellChess from '../WellChess';

import { createBrowserRouter } from 'react-router-dom';
const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/gobang', element: <GoBang /> },
    { path: '/wellchess', element: <WellChess /> },
]);
export default router;
