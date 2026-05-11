from ultralytics import YOLO
import json

# Load trained model
model = YOLO("runs/detect/train-2/weights/best.pt")

video_path = "backend/videos/ensantinaClipped.mp4"

results = model.track(
    source=video_path,
    persist=True,
    save=True,
    tracker="bytetrack.yaml"
)

frames = []
tracks = {}

frame_id = 0
FPS = 30  

for r in results:
    frame_id += 1
    detections = []

    if r.boxes is not None:
        for box in r.boxes:

            # confidence (correct field)
            confidence = float(box.conf[0])

            # bbox in xywh format
            bbox = box.xywh[0].tolist()

            # FIXED TRACK ID EXTRACTION --------------------------------------------------------
            track_id = None
            if box.id is not None:
                track_id = int(box.id.item())

            # build per-frame detection
            detections.append({
                "class": "salamander",
                "confidence": confidence,
                "bbox": bbox,
                "track_id": track_id
            })

            # -------------------------
            # TRACK AGGREGATION
            # -------------------------
            if track_id is not None:

                if track_id not in tracks:
                    tracks[track_id] = {
                        "frames_visible": 0,
                        "first_seen_frame": frame_id,
                        "last_seen_frame": frame_id
                    }

                tracks[track_id]["frames_visible"] += 1
                tracks[track_id]["last_seen_frame"] = frame_id

    frames.append({
        "frame": frame_id,
        "detections": detections
    })

# -------------------------
# FINAL METRICS CALCULATION
# -------------------------
for t_id, data in tracks.items():
    frames_visible = data["frames_visible"]

    tracks[t_id]["dwell_time_seconds"] = frames_visible / FPS

    # simple placeholder distance metric
    tracks[t_id]["distance_pixels"] = frames_visible * 2

# -------------------------
# OUTPUT JSON (Phase 4 CONTRACT)
# -------------------------
output = {
    "video_url": "runs/detect/predict",
    "frames": frames,
    "tracks": tracks
}

# SAVE FILE
with open("runs/detect/metrics.json", "w") as f:
    json.dump(output, f, indent=2)

print("Metrics JSON successfully generated at runs/detect/metrics.json")