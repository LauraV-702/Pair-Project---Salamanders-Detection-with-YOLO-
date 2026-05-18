# Salamander Tracker with YOLO

## Project Overview

Salamander Tracker is a full-stack computer vision application that detects and tracks salamanders in videos using YOLO object detection and tracking. Users can upload a salamander video through a web interface, process it using a trained YOLO model, view an annotated version of the video with bounding boxes, and analyze behavior metrics generated from the detections.

The project combines:

- React frontend
- Express backend
- Python YOLO processing scripts
- YOLOv8 model training and tracking
- Video processing and analytics

---

## Features

### Detection and Tracking
- Salamander detection using a custom-trained YOLOv8 model
- Bounding boxes drawn on each detected salamander
- Persistent object tracking using `track_id`

### Metrics Implemented

The following metrics were implemented:

#### 1. Dwell Time
Tracks how long an individual salamander remains visible in the video.

Example:

```json
"dwell_time_seconds": 16.53
```

#### 2. Distance Traveled
Measures estimated movement distance across tracked frames.

Example:

```json
"distance_pixels": 992
```

#### 3. Per-frame Detection Data
Stores frame-by-frame information including:

- frame number
- confidence score
- bounding boxes
- tracking IDs

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express
- Multer
- Child Process API

### Machine Learning / Computer Vision
- Python
- YOLOv8
- Ultralytics
- OpenCV

---

## Dataset Information

The dataset was created using manually labeled salamander images.

Dataset structure:

```text
dataset/
│
├── images/
│   ├── train/
│   ├── val/
│
├── labels/
│   ├── train/
│   ├── val/
│
└── data.yaml
```

Data included:

- Salamander images extracted from videos
- YOLO bounding box labels
- Single object class:

```yaml
names:
  0: salamander
```

---

## Training Process

The model was trained using Ultralytics YOLOv8.

Training command:

```bash
python scripts/train.py
```

Equivalent command:

```bash
yolo detect train model=yolov8n.pt data=dataset/data.yaml epochs=30 imgsz=640
```

Training results:

| Metric | Result |
|----------|--------|
| Precision | 1.00 |
| Recall | 0.993 |
| mAP50 | 0.995 |

The goal of the initial training run was to verify that the model could successfully learn salamander features before focusing on optimization.

---

## Running the Application

### Clone repository

```bash
git clone <repository-url>
```

---

### Install frontend dependencies

```bash
cd frontend

npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

### Install backend dependencies

```bash
cd backend

npm install
```

Install required packages:

```bash
npm install express multer cors
```

Run backend:

```bash
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

---

### Install Python dependencies

```bash
pip install ultralytics
pip install opencv-python
pip install torch
```

---

## Project Workflow

Application pipeline:

```text
Upload Video
        ↓
React Frontend
        ↓
Express Backend
        ↓
Python YOLO Script
        ↓
Object Detection + Tracking
        ↓
Generate Metrics JSON
        ↓
Return Annotated Video + Metrics
        ↓
Display Results
```

---

## Data Contract

Backend returns:

```json
{
  "video_url":"string",

  "frames":[
    {
      "frame":1,
      "detections":[
        {
          "class":"salamander",
          "confidence":0.84,
          "bbox":[x,y,w,h],
          "track_id":1
        }
      ]
    }
  ],

  "tracks":{
    "1":{
      "frames_visible":496,
      "dwell_time_seconds":16.53,
      "distance_pixels":992
    }
  }
}
```

---

## Color Masking vs YOLO Comparison

Color masking and YOLO both detect salamanders, but they perform differently depending on the situation.

Color masking works well when salamanders have a highly distinct color and the background remains consistent. In simple scenes with stable lighting and high contrast, color masking can identify salamanders quickly and with lower computational cost.

YOLO performed significantly better when backgrounds became more complex or lighting conditions changed. During testing, YOLO successfully detected salamanders even when the salamander color blended with surrounding rocks, leaves, or shadows. Color masking would likely struggle in these situations because it relies heavily on predefined color thresholds.

However, color masking could sometimes perform equally well or even better when salamanders were clearly separated from the background and color differences were strong. Color masking also requires much less processing power than a trained object detection model.

Overall, YOLO produced more robust and reliable detection results across different environments.

---

## What We Would Build With More Time

If more time were available, the next feature we would implement would be a salamander heatmap visualization.

The heatmap would display where salamanders spent most of their time throughout the video and provide a visual summary of movement patterns.

This feature was not included in the current version because higher priority tasks included:

- model training
- tracking implementation
- backend integration
- frontend development
- asynchronous processing and progress tracking

---

## Major Challenges

Some challenges encountered during development included:

- organizing and formatting training datasets
- configuring YOLO data files
- handling video processing performance
- integrating Python scripts with Express
- implementing asynchronous processing and progress polling
- generating aggregated metrics from tracking results

---