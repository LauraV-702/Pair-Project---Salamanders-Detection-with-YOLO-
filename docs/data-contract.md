{
  "video_url": "string",

  "frames": [
    {
      "frame": "number",
      "timestamp": "number",
      "detections": [
        {
          "class": "salamander",
          "confidence": "number",
          "bbox": ["x", "y", "w", "h"],
          "track_id": "number | null"
        }
      ]
    }
  ],

  "tracks": {
    "track_id": {
      "frames_visible": "number",
      "dwell_time_seconds": "number",
      "distance_pixels": "number",
      "first_seen_frame": "number",
      "last_seen_frame": "number"
    }
  }
}