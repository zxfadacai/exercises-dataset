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

# ---- 卡片标签翻译 ----
rep("catTag.textContent = ex.category;",
    "catTag.textContent = zh(ex.category);", 'card-cat')
rep("equipTag.textContent = ex.equipment;",
    "equipTag.textContent = zh(ex.equipment);", 'card-equip')

# ---- modal metaItems: label 和 value 翻译 ----
rep("{ label: 'Body Part', value: ex.body_part || ex.category },",
    "{ label: '\u90e8\u4f4d', value: zh(ex.body_part || ex.category) },", 'modal-bodypart')
rep("{ label: '\u5668\u68b0', value: ex.equipment },",
    "{ label: '\u5668\u68b0', value: zh(ex.equipment) },", 'modal-equip')
rep("{ label: '\u76ee\u6807',    value: ex.target },",
    "{ label: '\u76ee\u6807',    value: zh(ex.target) },", 'modal-target')

# ---- modal muscles 标签 ----
rep("musclesHeader.textContent = 'Muscles';",
    "musclesHeader.textContent = '\u808c\u7fa4';", 'modal-muscles')

# ---- modal meta chip value 也翻译(肌肉名) ----
# makeMuscleGroup 里的 names 需要翻译
rep("lbl.textContent = title;",
    "lbl.textContent = title;", 'noop')

with open('_index_tmp.html', 'w', encoding='utf-8', newline='') as f:
    f.write(s)
os.replace('_index_tmp.html', 'index.html')
print(f'\n=== done, {n} replacements ===')
