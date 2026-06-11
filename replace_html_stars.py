import re

with open('e:/Vital Dental/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", # 1
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150", # 2
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150", # 3
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", # 4
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", # 5
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150", # 6
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", # 7
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150", # 8
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"  # 9
]

colors = [
    "rgba(14,165,233,0.15)", # blue
    "rgba(139,92,246,0.15)", # purple
    "rgba(244,63,94,0.15)",  # rose
    "rgba(16,185,129,0.15)", # emerald
    "rgba(245,158,11,0.15)", # amber
    "rgba(99,102,241,0.15)", # indigo
    "rgba(236,72,153,0.15)", # pink
    "rgba(20,184,166,0.15)", # teal
    "rgba(132,204,22,0.15)"  # lime
]

new_testimonials = f"""                <div class="testimonials-scroller" role="region" aria-label="Scrolling Testimonials">
                    <!-- Column 1 -->
                    <div class="testimonials-column" style="--duration: 25s">
                        <ul class="testimonials-track">
                            <!-- Set 1 -->
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[0]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I was very nervous about my root extraction, but Dr. Pragati Singh made the entire process so easy and stress-free. She is incredibly skilled and ensured the procedure was completely pain-free."</p>
                                    <footer class="t-author">
                                        <img src="{images[0]}" alt="Richa Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Richa Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[1]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had this extreme fear of going to dentists but came to Vital Dental Care for my excruciating tooth pain. Dr. Pragati explained everything to me clearly and made me feel so comfortable."</p>
                                    <footer class="t-author">
                                        <img src="{images[1]}" alt="Tej Suryawanshi" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Tej Suryawanshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[2]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"The clinic has the most advanced equipment in Dehradun. I went for a dental implant and the 3D scanning made the whole process incredibly precise and reassuring. Best implant center!"</p>
                                    <footer class="t-author">
                                        <img src="{images[2]}" alt="Karan Sharma" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Karan Sharma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[0]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I was very nervous about my root extraction, but Dr. Pragati Singh made the entire process so easy and stress-free. She is incredibly skilled and ensured the procedure was completely pain-free."</p>
                                    <footer class="t-author">
                                        <img src="{images[0]}" alt="Richa Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Richa Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[1]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had this extreme fear of going to dentists but came to Vital Dental Care for my excruciating tooth pain. Dr. Pragati explained everything to me clearly and made me feel so comfortable."</p>
                                    <footer class="t-author">
                                        <img src="{images[1]}" alt="Tej Suryawanshi" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Tej Suryawanshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[2]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"The clinic has the most advanced equipment in Dehradun. I went for a dental implant and the 3D scanning made the whole process incredibly precise and reassuring. Best implant center!"</p>
                                    <footer class="t-author">
                                        <img src="{images[2]}" alt="Karan Sharma" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Karan Sharma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                        </ul>
                    </div>

                    <!-- Column 2 -->
                    <div class="testimonials-column hidden-mobile" style="--duration: 35s">
                        <ul class="testimonials-track">
                            <!-- Set 1 -->
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[3]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I’m really happy with my dental treatment. Ma’am explained everything clearly and made sure I was comfortable throughout the procedure. I went there for scaling and cleaning, results were great."</p>
                                    <footer class="t-author">
                                        <img src="{images[3]}" alt="Yash Mahishwal" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Yash Mahishwal</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[4]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had a fantastic experience at Vital Dental! The staff was welcoming and professional. Dr. Pragati was thorough, explaining everything clearly and ensuring I felt no discomfort."</p>
                                    <footer class="t-author">
                                        <img src="{images[4]}" alt="Lalit Chauhan" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Lalit Chauhan</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[5]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"Dr. Pragati takes her time to explain every single step. For someone who is terrified of needles, the local anesthesia was completely painless. Highly recommend for cosmetic dentistry!"</p>
                                    <footer class="t-author">
                                        <img src="{images[5]}" alt="Priya Verma" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Priya Verma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[3]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I’m really happy with my dental treatment. Ma’am explained everything clearly and made sure I was comfortable throughout the procedure. I went there for scaling and cleaning, results were great."</p>
                                    <footer class="t-author">
                                        <img src="{images[3]}" alt="Yash Mahishwal" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Yash Mahishwal</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[4]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had a fantastic experience at Vital Dental! The staff was welcoming and professional. Dr. Pragati was thorough, explaining everything clearly and ensuring I felt no discomfort."</p>
                                    <footer class="t-author">
                                        <img src="{images[4]}" alt="Lalit Chauhan" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Lalit Chauhan</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[5]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"Dr. Pragati takes her time to explain every single step. For someone who is terrified of needles, the local anesthesia was completely painless. Highly recommend for cosmetic dentistry!"</p>
                                    <footer class="t-author">
                                        <img src="{images[5]}" alt="Priya Verma" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Priya Verma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                        </ul>
                    </div>

                    <!-- Column 3 -->
                    <div class="testimonials-column hidden-tablet" style="--duration: 29s">
                        <ul class="testimonials-track">
                            <!-- Set 1 -->
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[6]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had awesome experience from Vital Dental Care. Dr. Pragati is very humble, polite & knowledgeable. I got totally painless RCT. Clinic is very hygienic & fully equipped!"</p>
                                    <footer class="t-author">
                                        <img src="{images[6]}" alt="Neha Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Neha Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[7]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had very informative & knowledgeable consultation from Vital Dental Care. Dr. Pragati explained everything in detail regarding my RCT & Bridge. I am very satisfied with my treatment!"</p>
                                    <footer class="t-author">
                                        <img src="{images[7]}" alt="Neelesh Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Neelesh Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[8]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"Got my Invisalign braces from here. The clear aligners are so comfortable and the progress tracking is fantastic. Best orthodontics experience I've ever had."</p>
                                    <footer class="t-author">
                                        <img src="{images[8]}" alt="Rohit Joshi" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Rohit Joshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[6]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had awesome experience from Vital Dental Care. Dr. Pragati is very humble, polite & knowledgeable. I got totally painless RCT. Clinic is very hygienic & fully equipped!"</p>
                                    <footer class="t-author">
                                        <img src="{images[6]}" alt="Neha Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Neha Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[7]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"I had very informative & knowledgeable consultation from Vital Dental Care. Dr. Pragati explained everything in detail regarding my RCT & Bridge. I am very satisfied with my treatment!"</p>
                                    <footer class="t-author">
                                        <img src="{images[7]}" alt="Neelesh Singh" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Neelesh Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true" style="background: linear-gradient(135deg, rgba(255,255,255,0.7), {colors[8]});">
                                <blockquote class="t-blockquote">
                                    <div class="t-stars" style="color: #F59E0B; margin-bottom: 10px; font-size: 1.2rem; letter-spacing: 2px;">★★★★★</div>
                                    <p class="t-text">"Got my Invisalign braces from here. The clear aligners are so comfortable and the progress tracking is fantastic. Best orthodontics experience I've ever had."</p>
                                    <footer class="t-author">
                                        <img src="{images[8]}" alt="Rohit Joshi" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                        <div>
                                            <h4>Rohit Joshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                        </ul>
                    </div>
                </div>"""

pattern = re.compile(r'                <div class="testimonials-scroller".*?</div>\s*</div>', re.DOTALL)
new_content = pattern.sub(new_testimonials, content)

with open('e:/Vital Dental/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
