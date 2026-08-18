import json
from pathlib import Path
from collections import Counter

detect = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
scan_root = Path(detect.get('scan_root', '.')).resolve()

all_files = []
for cat in ('code', 'document', 'paper', 'image', 'video'):
    all_files.extend(detect.get('files', {}).get(cat, []))

subdirs = Counter()
for f in all_files:
    p = Path(f).resolve()
    try:
        rel = p.relative_to(scan_root)
        parts = rel.parts
        if len(parts) > 1:
            subdirs[parts[0]] += 1
        else:
            subdirs['(root)'] += 1
    except ValueError:
        pass

print("Top 5 subdirectories by file count:")
for subdir, count in subdirs.most_common(5):
    print(f"  {subdir}: {count} files")
