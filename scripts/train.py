from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="dataset/data.yaml",
    epochs=10,     # lower
    imgsz=416,     # smaller images = MUCH faster
    batch=4        # lighter memory load
)