from ultralytics import YOLO

model = YOLO("runs/detect/train-2/weights/best.pt")

results = model(
    "backend/videos/ensantinaClipped.mp4",
    save=True
)

print("Video inference complete!")

# run command: python scripts/inference_video.py