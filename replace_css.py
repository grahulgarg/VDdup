import re

with open('e:/Vital Dental/styles/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """
/* Testimonials Infinite Scroll */
.testimonials-section {
    position: relative;
    overflow: hidden;
    padding: 80px 0;
}

.testimonials-scroller {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 40px;
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
    max-height: 700px;
    overflow: hidden;
}

.testimonials-column {
    display: flex;
    flex-direction: column;
}

.testimonials-track {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 24px;
    list-style: none;
    margin: 0;
    animation: scrollVertical var(--duration) linear infinite;
}

/* Pause animation on hover */
.testimonials-column:hover .testimonials-track {
    animation-play-state: paused;
}

@keyframes scrollVertical {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(-50%);
    }
}

.testimonial-card {
    background: var(--color-white);
    padding: 32px;
    border-radius: 24px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    max-width: 320px;
    width: 100%;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
    cursor: default;
}

.testimonial-card:hover {
    transform: translateY(-8px) scale(1.03);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
    z-index: 2;
    position: relative;
}

.t-blockquote {
    margin: 0;
    padding: 0;
}

.t-text {
    color: var(--color-text);
    line-height: 1.6;
    margin: 0;
    font-size: 1.05rem;
}

.t-author {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
}

.t-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
}

.t-author h4 {
    margin: 0;
    font-size: 1rem;
    color: var(--color-primary-dark);
    font-weight: 700;
}

.t-author span {
    font-size: 0.85rem;
    color: var(--color-text-light);
    display: block;
    margin-top: 2px;
}

@media (max-width: 1024px) {
    .hidden-tablet {
        display: none !important;
    }
}

@media (max-width: 768px) {
    .hidden-mobile {
        display: none !important;
    }
}
"""

# Regex to match the old block
pattern = re.compile(r'\.testimonials-slider-container\s*{.*?\.prev-btn\s*{.*?\}', re.DOTALL)

# Add it after .section-header p
new_content = pattern.sub(new_css, content)

# Remove the `.next-btn { ... }` which might be left over
pattern_next = re.compile(r'\.next-btn\s*{.*?\}', re.DOTALL)
new_content = pattern_next.sub('', new_content)


with open('e:/Vital Dental/styles/main.css', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
