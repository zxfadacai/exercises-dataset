import os
s = open('index.html', encoding='utf-8').read()
n = 0
def rep(old, new, tag):
    global s, n
    c = s.count(old)
    if c:
        s = s.replace(old, new); n += c
        print(f'[{tag}] {c}x OK')
    else:
        print(f'[{tag}] MISS')

# 肌肉名翻译
rep("        t.textContent = name;\n        row.appendChild(t);",
    "        t.textContent = zh(name);\n        row.appendChild(t);", 'muscle-name')

with open('_index_tmp.html', 'w', encoding='utf-8', newline='') as f:
    f.write(s)
os.replace('_index_tmp.html', 'index.html')
print(f'\n=== done, {n} replacements ===')
