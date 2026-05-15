import { useState } from 'react'
import './App.css'

function App() {

  const [selectedFile, setSelectedFile] = useState(null)
  const [videoURL, setVideoURL] = useState(null)

  const [progress, setProgress] = useState(0)
  const [jobStatus, setJobStatus] = useState('idle')
  const [metrics, setMetrics] = useState(null)

  const handleFileChange = (event) => {

    const file = event.target.files[0]

    if (file) {

      setSelectedFile(file)

      setVideoURL(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {

    if (!selectedFile) {

      alert('Please upload a video first.')

      return
    }

    const formData = new FormData()

    formData.append('video', selectedFile)

    try {

      setJobStatus('processing')

      setProgress(0)

      await fetch('http://localhost:3000/process-video', {
        method: 'POST',
        body: formData
      })

      const interval = setInterval(async () => {

        const response = await fetch('http://localhost:3000/track')

        const data = await response.json()

        setJobStatus(data.status)

        setProgress(data.percent || 0)

        if (data.status === 'done') {

          clearInterval(interval)

          setMetrics(data.result)

          alert('Video processing complete!')
        }

        if (data.status === 'error') {

          clearInterval(interval)

          alert(data.message)
        }

      }, 1000)

    } catch (error) {

      console.error(error)

      alert('Error processing video.')
    }
  }

  return (
    <div className="app">

      <header className="hero-section">

        <div className="overlay"></div>

        <div className="hero-content">
          <h1>Salamander Pair Project</h1>
        </div>

      </header>

      <main className="dashboard">

        <section className="upload-panel">

          <h2>Upload Salamander Video</h2>

          <p>
            Select a salamander recording to generate tracked detections and
            behavioral metrics.
          </p>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="selected-file">
              <p>{selectedFile.name}</p>
            </div>
          )}

          <button onClick={handleUpload}>
            Process Video
          </button>

          {jobStatus === 'processing' && (
            <div style={{ marginTop: '20px' }}>

              <p>
                Processing Video... {progress}%
              </p>

              <progress
                value={progress}
                max="100"
                style={{ width: '100%' }}
              />

            </div>
          )}

        </section>

        <section className="preview-panel">

          <h2>Video Preview</h2>

          {videoURL ? (

            <video controls width="100%">

              <source src={videoURL} type={selectedFile.type} />

              Your browser does not support video playback.

            </video>

          ) : (

            <div className="empty-state">
              <p>No video selected yet.</p>
            </div>

          )}

        </section>

        <section className="metrics-panel">

          <h2>Detection Metrics</h2>

          <div className="metric-grid">

            <div className="metric-card">

              <h3>Dwell Time</h3>

              <p>
                {metrics
                  ? `${Object.values(metrics.tracks)[0]?.dwell_time_seconds.toFixed(2)} sec`
                  : '--'}
              </p>

            </div>

            <div className="metric-card">

              <h3>Distance Traveled</h3>

              <p>
                {metrics
                  ? `${Object.values(metrics.tracks)[0]?.distance_pixels}px`
                  : '--'}
              </p>

            </div>

            <div className="metric-card">

              <h3>Total Tracks</h3>

              <p>
                {metrics
                  ? Object.keys(metrics.tracks).length
                  : '--'}
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default App