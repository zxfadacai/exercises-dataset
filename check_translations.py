import json
from collections import defaultdict

with open('data/exercises.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

lang_counts = defaultdict(int)
missing = []
total = len(data)

for ex in data:
    instructions = ex.get('instructions', {})
    for lang in instructions:
        lang_counts[lang] += 1
    # Check which langs are missing for this exercise
    all_langs = set(lang_counts.keys())
    for lang in all_langs:
        if lang not in instructions:
            missing.append((ex['id'], ex['name'], lang))

print(f"Total exercises: {total}")
print("\nLanguage coverage:")
for lang, count in sorted(lang_counts.items()):
    print(f"  {lang}: {count} ({count/total*100:.1f}%)")

if missing:
    print(f"\nMissing translations: {len(missing)}")
    for item in missing[:10]:
        print(f"  Exercise {item[0]} ({item[1]}) missing {item[2]}")
    if len(missing) > 10:
        print(f"  ... and {len(missing)-10} more")
else:
    print("\nAll exercises have all language translations!")
