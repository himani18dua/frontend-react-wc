import React, { useState, useContext } from 'react';
import DataContext from './DataContext';

function CrawlImages() {
    const { data, setData } = useContext(DataContext);
    const [url, setUrl] = useState('');

    const handleImageCrawl = async () => {
        setData(prevData => ({ ...prevData, loadingImages: true, errorImages: null }));
        try {
            const response = await fetch('http://localhost:5000/img-crawl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                throw new Error('Image Crawl request failed');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            fetchImageData();
        } catch (err) {
            setData(prevData => ({ ...prevData, errorImages: err.message, crawlImagesData: [], loadingImages: false }));
        }
    };

    const fetchImageData = async () => {
        try {
            const response = await fetch("http://localhost:5000/img-members");
            if (!response.ok) {
                throw new Error('Failed to fetch image data');
            }
            const data = await response.json();
            setData(prevData => ({ ...prevData, crawlImagesData: data, loadingImages: false }));
        } catch (error) {
            console.error('Error fetching image data:', error);
            setData(prevData => ({ ...prevData, errorImages: 'Failed to fetch image data', loadingImages: false }));
        }
    };

    const handleImageDownload = () => {
        fetch('http://localhost:5000/img-download')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'images_without_alt.pdf');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => console.error('Image Download failed:', err));
    };

    return (
        <div>
            <h1>Crawl Images</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={handleImageCrawl}>Crawl</button>
            {data.crawlImagesData.length > 0 && (
                <div>
                    <button onClick={handleImageDownload}>Download PDF</button>
                    <ul>
                    <div className="container2"><p className="broken">Number of images without alt text found: {data.crawlImagesData.length}</p></div>
                        {data.crawlImagesData.map((item, index) => (
                            <li key={index}>
                                <p><strong>Source Page:</strong> <a href={item.source_page} target="_blank" rel="noopener noreferrer">{item.source_page}</a></p>
                                <p><strong>Image URL:</strong> <a href={item.image_url} target="_blank" rel="noopener noreferrer">{item.image_url}</a></p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {data.loadingImages && <p>Loading...</p>}
            {data.errorImages && <p>Error: {data.errorImages}</p>}
        </div>
    );
}

export default CrawlImages;
