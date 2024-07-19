import React, { useState, useContext } from 'react';
import DataContext from './DataContext';

function CrawlLinks() {
    const { data, setData } = useContext(DataContext);
    const [url, setUrl] = useState('');
    const [taskId, setTaskId] = useState(null);

    const handleCrawl = async () => {
        setData(prevData => ({ ...prevData, loadingLinks: true, errorLinks: null }));
        try {
            const response = await fetch('https://fin-back-odw1.onrender.com/crawl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Crawl request failed');
            }

            setTaskId(result.task_id);
            pollStatus(result.task_id);
        } catch (err) {
            setData(prevData => ({ ...prevData, errorLinks: err.message, crawlLinksData: [], loadingLinks: false }));
        }
    };

    const pollStatus = async (task_id) => {
        try {
            const interval = setInterval(async () => {
                const response = await fetch(`https://fin-back-odw1.onrender.com/task-status/${task_id}`);
                const result = await response.json();

                if (result.state === 'SUCCESS') {
                    clearInterval(interval);
                    fetchData();
                } else if (result.state === 'FAILURE') {
                    clearInterval(interval);
                    setData(prevData => ({ ...prevData, errorLinks: 'Crawl task failed', crawlLinksData: [], loadingLinks: false }));
                }
            }, 5000);
        } catch (err) {
            setData(prevData => ({ ...prevData, errorLinks: 'Error polling status', crawlLinksData: [], loadingLinks: false }));
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('https://fin-back-odw1.onrender.com/members');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setData(prevData => ({ ...prevData, crawlLinksData: data, loadingLinks: false }));
        } catch (error) {
            console.error('Error fetching data:', error);
            setData(prevData => ({ ...prevData, errorLinks: 'Failed to fetch data', loadingLinks: false }));
        }
    };

    const handleDownload = () => {
        fetch('https://fin-back-odw1.onrender.com/download')
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'broken_links.pdf');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch(err => console.error('Download failed:', err));
    };

    return (
        <div>
            <h1>Crawl Links</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
            />
            <button onClick={handleCrawl}>Crawl</button>
            {data.crawlLinksData.length > 0 && (
                <div>
                    <button onClick={handleDownload}>Download PDF</button>
                    <ul>
                        <div className="container2"><p className="broken">Number of broken links found: {data.crawlLinksData.length}</p></div>
                        {data.crawlLinksData.map((item, index) => (
                            <li key={index}>
                                <p><strong>Source Page:</strong> <a href={item.Source_Page} target="_blank" rel="noopener noreferrer">{item.Source_Page}</a></p>
                                <p><strong>Link Text:</strong> {item.Link_Text}</p>
                                <p><strong>Broken Page Link:</strong> <a href={item.Broken_Page_Link} target="_blank" rel="noopener noreferrer">{item.Broken_Page_Link}</a></p>
                                <p><strong>HTTP Code:</strong> {item.HTTP_Code}</p>
                                <p><strong>External:</strong> {item.External ? 'Yes' : 'No'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {data.loadingLinks && <p>Loading...</p>}
            {data.errorLinks && <p>Error: {data.errorLinks}</p>}
        </div>
    );
}

export default CrawlLinks;
