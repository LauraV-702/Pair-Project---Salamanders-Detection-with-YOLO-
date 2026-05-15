const express = require('express')
const multer = require('multer')
const cors = require('cors')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors())

const upload = multer({ dest: 'uploads/' })

// ----------------------------
// SHARED JOB STATE
// ----------------------------
let job = {
  status: 'idle',
  percent: 0,
  result: null,
  message: null
}

// ----------------------------
// BACKGROUND WORKER
// ----------------------------
function runTrackJob(videoPath) {

  console.log('Starting YOLO processing...')

  const python = spawn('python', [
    '../scripts/generate_metrics.py',
    videoPath
  ])

  python.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  python.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  python.on('error', (err) => {

    console.error(err)

    job.status = 'error'
    job.message = 'Failed to start Python process'
  })

  // Fake progress animation
  let fakeProgress = 0

  const interval = setInterval(() => {

    if (fakeProgress < 90) {

      fakeProgress += 5

      job.percent = fakeProgress
    }

  }, 1000)

  python.on('close', (code) => {

    clearInterval(interval)

    console.log(`Python exited with code ${code}`)

    try {

      const metricsPath = path.join(
        __dirname,
        '../runs/detect/metrics.json'
      )

      console.log('Reading metrics from:', metricsPath)

      const metrics = JSON.parse(
        fs.readFileSync(metricsPath, 'utf-8')
      )

      job.status = 'done'
      job.percent = 100
      job.result = metrics

      console.log('Metrics loaded successfully')

    } catch (err) {

      console.error(err)

      job.status = 'error'
      job.message = 'Failed to load metrics.json'
    }
  })
}

// ----------------------------
// START PROCESSING
// ----------------------------
app.post('/process-video', upload.single('video'), (req, res) => {

  console.log(req.file)

  job.status = 'processing'
  job.percent = 0
  job.result = null
  job.message = null

  runTrackJob(req.file.path)

  res.json({
    status: 'processing'
  })
})

// ----------------------------
// POLLING ENDPOINT
// ----------------------------
app.get('/track', (req, res) => {

  res.json(job)
})

// ----------------------------

app.listen(3000, () => {

  console.log('Server running on port 3000')
})