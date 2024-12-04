import React from 'react';
import AppRouter from './Router';
import FaviconChanger from './FaviconChanger';
import { FavoritesProvider } from './Context/FavoritesContext';
import { Toaster } from 'sonner';
import { InterestedProvider } from './Context/InterestedContext';
import { UserProvider } from './Context/UserContext';

function App() {
    return (
        <UserProvider>
            <FavoritesProvider>
                <InterestedProvider>
                    <Toaster richColors />
                    <FaviconChanger />
                    <AppRouter />
                </InterestedProvider>
            </FavoritesProvider>
        </UserProvider>

    );
}

export default App;