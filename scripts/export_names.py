import json
d = json.load(open('data/exercises.json', encoding='utf-8'))
with open('_names_en.txt', 'w', encoding='utf-8') as f:
    for ex in d:
        f.write(f"{ex['id']}\t{ex['name']}\n")
print(f"exported {len(d)} names")
