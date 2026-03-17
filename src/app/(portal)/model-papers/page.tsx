
'use client';

import { useEffect, useState } from 'react';

export default function ModelPapersPage() {
    const [papers, setPapers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/model-papers')
            .then((res) => res.json())
            .then((data) => {
                console.log("DATA:", data);
                setPapers(data);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Model Papers</h1>

            {papers.length === 0 ? (
                <p>No papers found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {papers.map((paper: any) => (
                        <div key={paper.id} className="p-4 border rounded-lg shadow">
                            <h2 className="font-semibold">{paper.title}</h2>
                            <p className="text-sm text-gray-500">{paper.subject}</p>

                            <a
                                href={paper.fileUrl}
                                target="_blank"
                                className="text-blue-600 mt-2 inline-block"
                            >
                                View Paper
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}