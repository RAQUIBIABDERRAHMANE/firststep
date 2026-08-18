import json
from pathlib import Path

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
files = detect.get('files', {})

print("Summary:")
for cat, flist in files.items():
    print(f"  {cat}: {len(flist)} files")

print("Total files:", detect.get('total_files'))
print("Total words:", detect.get('total_words'))
