import React, { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        crawlLinksData: [],
        crawlImagesData: [],
        loadingLinks: false,
        loadingImages: false,
        errorLinks: null,
        errorImages: null,
    });

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;
