import { React, useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ViewBook.css'
import { Document, Page, pdfjs } from 'react-pdf'
import { check_user_access } from '../../services/utils'
import { BASE_URL, fetchBook } from '../../services/api'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ViewBook() {

    const [numPages, setNumPages ] = useState(null)
    const [scale, setScale] = useState(1.0);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate()
    const { state } = useLocation()
    const accessToken = check_user_access(navigate)
    const book_id = state?.book_id 
    const book_name = state?.book_name 

    const onLoadSuccess = (pdf)=>{
        setNumPages(pdf.numPages)
    }

    const PDF_URL = `${BASE_URL}books/${book_id}/get_book/`
    const file = useMemo(() => ({
        url: PDF_URL,
        httpHeaders: {
            Authorization: accessToken 
        },
    }), [PDF_URL])

    const options = useMemo(()=>({
        disableTextLayer: true
    }), [])
  
    const containerRef = useRef(null)
    const [containerSize, setContainerSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    useEffect(() => {
        function handleResize() {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                })
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's')) {
                e.preventDefault();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    {
        console.log(book_id)
    }

    return (
        <div
            className="MYF-container"
            onContextMenu={e => e.preventDefault()}
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: darkMode ? '#181a1b' : '#fff',
                color: darkMode ? '#eee' : '#222'
            }}
        >
            {file ? (
                <>
                    <div
                        className="book-title-container"
                        style={{
                            flex: '0 0 auto',
                            padding: '16px 24px',
                            background: darkMode ? '#222' : '#fff',
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    fontSize: '1.2rem',
                                    background: 'none',
                                    border: 'none',
                                    color: darkMode ? '#ffd700' : '#222',
                                    cursor: 'pointer',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                &#8592; Back
                            </button>
                        </div>
                        <div style={{ flex: 2, textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: darkMode ? '#ffd700' : '#222' }}>{book_name}</p>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                              onClick={() => setDarkMode(dm => !dm)}
                              style={{
                                marginLeft: 12,
                                background: 'none',
                                border: 'none',
                                color: darkMode ? '#ffd700' : '#222',
                                fontSize: '1.2rem',
                                cursor: 'pointer'
                              }}
                              title="Toggle dark mode"
                            >
                              {darkMode ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                    <div
                        className="document-container"
                        ref={containerRef}
                        style={{
                            flex: 1,
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            background: darkMode ? '#23272f' : '#fff',
                            width: '100vw',
                            height: '100%',
                        }}
                    >
                        <Document
                            file={file}
                            options={options}
                            onLoadSuccess={onLoadSuccess}
                            onLoadError={error =>
                                console.log('Error loading document: ', error)
                            }
                            loading={
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: 500
                                }}>
                                    <span style={{
                                        fontSize: '1.3rem',
                                        color: darkMode ? '#ffd700' : '#222'
                                    }}>
                                        Loading your book...
                                    </span>
                                </div>
                            }
                        >
                            {numPages &&
                                Array.from(new Array(numPages), (el, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        className="pdf-page"
                                        scale={scale}
                                    />
                                ))}
                        </Document>
                    </div>
                    <div className="bottom-bar" style={{
      background: darkMode ? '#23272f' : '#222',
      color: darkMode ? '#eee' : '#fff'
    }}>
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>-</button>
                        <span style={{margin: '0 12px'}}>Zoom</span>
                        <button onClick={() => setScale(s => Math.min(3, s + 0.2))}>+</button>
                    </div>
                </>
            ) : (
                <p>You donot have access to this book.</p>
            )}
        </div>
    )
}

export default ViewBook