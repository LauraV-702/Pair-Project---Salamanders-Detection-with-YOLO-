import cv2
import os

# Path to the video file
video_path = 'videos/ensantinaClipped.mp4'

# Output directory for frames
output_dir = 'frames'

# Target number of extracted frames
target_frames = 150

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Open the video file
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print(f"Error: Could not open video file {video_path}")
    exit(1)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
if total_frames <= 0:
    print("Warning: could not read total frame count from video.")
    total_frames = None

sample_rate = 1
if total_frames and total_frames > target_frames:
    sample_rate = max(1, total_frames // target_frames)

frame_count = 0
saved_count = 0

print(f"Extracting up to {target_frames} frames from {video_path}...")

while True:
    ret, frame = cap.read()
    if not ret or saved_count >= target_frames:
        break

    if frame_count % sample_rate == 0:
        frame_filename = os.path.join(output_dir, f'frame_{saved_count:04d}.jpg')
        cv2.imwrite(frame_filename, frame)
        saved_count += 1
        print(f"Saved {frame_filename}")

    frame_count += 1

cap.release()
print(f"Extraction complete. Total frames extracted: {saved_count}")