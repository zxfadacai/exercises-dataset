import json
d = json.load(open('data/exercises.json', encoding='utf-8'))
for ex in d[:10]:
    zh = ex['instruction_steps'].get('zh', [])
    s1 = zh[0][:50] if zh else ''
    print(f"{ex['id']}  {ex['name']}  | zh: {s1}")
