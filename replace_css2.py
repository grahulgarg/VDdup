import re

with open('e:/Vital Dental/styles/main.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = """
/* Testimonials Infinite Scroll - Liquid Glassomorphism */
.testimonials-section {
    position: relative;
    overflow: hidden;
    padding: 80px 0;
    background-color: var(--color-bg-alt);
    z-index: 1;
}

/* Decorative Blobs for Glass Effect */
.glass-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    z-index: -1;
    opacity: 0.6;
    animation: blobFloat 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
}

.blob-1 {
    top: -10%;
    left: 10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(14,165,233,0.4) 0%, rgba(14,165,233,0) 70%);
}

.blob-2 {
    bottom: -10%;
    right: 10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%);
    animation-delay: -10s;
}

@keyframes blobFloat {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(100px, 50px) scale(1.2); }
    100% { transform: translate(-50px, 150px) scale(0.9); }
}

.testimonials-section .container {
    position: relative;
    z-index: 2;
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
    width: 100%;
}

.testimonials-column {
    display: flex;
    flex-direction: column;
    width: 320px;
    min-width: 320px;
    flex-shrink: 0;
    max-width: 100%;
}

.testimonials-track {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 24px;
    list-style: none;
    margin: 0;
    animation: scrollVertical var(--duration) linear infinite;
    width: 100%;
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
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 32px;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    width: 320px;
    min-width: 320px;
    max-width: 100%;
    box-sizing: border-box;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, background 0.4s ease;
    cursor: default;
    position: relative;
    overflow: hidden;
}

.testimonial-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    transition: left 0.7s ease;
    z-index: 1;
}

.testimonial-card:hover::before {
    left: 200%;
}

.testimonial-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.6);
    z-index: 5;
}

.t-blockquote {
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 2;
}

.t-text {
    color: var(--color-text);
    line-height: 1.6;
    margin: 0;
    font-size: 1.05rem;
    position: relative;
    z-index: 2;
}

.t-author {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    position: relative;
    z-index: 2;
}

.t-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary-light), #fff);
    color: var(--color-primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border: 2px solid white;
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

pattern = re.compile(r'/\* Testimonials Infinite Scroll \*/.*?\.hidden-mobile\s*{\s*display:\s*none\s*!important;\s*}\s*}', re.DOTALL)
new_content = pattern.sub(new_css, content)

with open('e:/Vital Dental/styles/main.css', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
