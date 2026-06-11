import re

with open('e:/Vital Dental/styles/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the tablet media query leftover
content = re.sub(r'/\* Responsive adjustments for slider visibility \*/\s*@media \(min-width: 768px\) {\s*\.testimonial-card {\s*flex:.*?max-width:.*?}\s*\.prev-btn {\s*left: -20px;\s*}\s*}', '', content, flags=re.DOTALL)

# Remove the desktop media query leftover
content = re.sub(r'@media \(min-width: 1024px\) {\s*\.testimonial-card {\s*flex:.*?max-width:.*?}\s*}', '', content, flags=re.DOTALL)

# Remove the leftover .testimonials-slider-container and .testimonial-card in the max-width: 768px media query
content = re.sub(r'\.testimonials-slider-container\s*{\s*padding:\s*0\s*var\(--spacing-sm\);\s*}', '', content, flags=re.DOTALL)
content = re.sub(r'\.testimonial-card\s*{\s*padding:\s*var\(--spacing-md\);\s*}', '', content, flags=re.DOTALL)

# Just to be sure, any other .testimonial-card that has flex:
content = re.sub(r'\.testimonial-card\s*{\s*flex:\s*0\s*0\s*calc.*?\s*max-width:\s*calc.*?\s*}', '', content, flags=re.DOTALL)

with open('e:/Vital Dental/styles/main.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
