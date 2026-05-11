from ultralytics import YOLO

# Load trained model
model = YOLO("runs/detect/train-2/weights/best.pt")

# Run inference on one image
results = model("dataset/images/0a343b6d-frame_0124.jpg", save=True)

print("Inference complete!")

# run command: python scripts/inference_image.py