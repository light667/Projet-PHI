import docx
doc = docx.Document('PHI_CDC_v2_ZeroBudget.docx')
with open('phi_spec.txt', 'w', encoding='utf-8') as f:
    for p in doc.paragraphs:
        f.write(p.text + '\n')
print("Done")
