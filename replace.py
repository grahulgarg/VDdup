import re

with open('e:/Vital Dental/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_testimonials = """        <!-- Testimonials Section -->
        <section id="testimonials" class="section testimonials-section" aria-labelledby="testimonials-heading">
            <div class="container">
                <div class="section-header">
                    <div class="badge-wrapper">
                        <span class="section-badge">Testimonials</span>
                    </div>
                    <h2 id="testimonials-heading">What our patients say</h2>
                    <p>Discover how we've helped hundreds of patients achieve perfect smiles and oral health.</p>
                </div>

                <div class="testimonials-scroller" role="region" aria-label="Scrolling Testimonials">
                    <!-- Column 1 -->
                    <div class="testimonials-column" style="--duration: 25s">
                        <ul class="testimonials-track">
                            <!-- Set 1 -->
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I was very nervous about my root extraction, but Dr. Pragati Singh made the entire process so easy and stress-free. She is incredibly skilled and ensured the procedure was completely pain-free."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">RS</div>
                                        <div>
                                            <h4>Richa Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I had this extreme fear of going to dentists but came to Vital Dental Care for my excruciating tooth pain. Dr. Pragati explained everything to me clearly and made me feel so comfortable."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">TS</div>
                                        <div>
                                            <h4>Tej Suryawanshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"The clinic has the most advanced equipment in Dehradun. I went for a dental implant and the 3D scanning made the whole process incredibly precise and reassuring. Best implant center!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">KS</div>
                                        <div>
                                            <h4>Karan Sharma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I was very nervous about my root extraction, but Dr. Pragati Singh made the entire process so easy and stress-free. She is incredibly skilled and ensured the procedure was completely pain-free."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">RS</div>
                                        <div>
                                            <h4>Richa Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I had this extreme fear of going to dentists but came to Vital Dental Care for my excruciating tooth pain. Dr. Pragati explained everything to me clearly and made me feel so comfortable."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">TS</div>
                                        <div>
                                            <h4>Tej Suryawanshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"The clinic has the most advanced equipment in Dehradun. I went for a dental implant and the 3D scanning made the whole process incredibly precise and reassuring. Best implant center!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">KS</div>
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
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I’m really happy with my dental treatment. Ma’am explained everything clearly and made sure I was comfortable throughout the procedure. I went there for scaling and cleaning, results were great."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">YM</div>
                                        <div>
                                            <h4>Yash Mahishwal</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I had a fantastic experience at Vital Dental! The staff was welcoming and professional. Dr. Pragati was thorough, explaining everything clearly and ensuring I felt no discomfort."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">LC</div>
                                        <div>
                                            <h4>Lalit Chauhan</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"Dr. Pragati takes her time to explain every single step. For someone who is terrified of needles, the local anesthesia was completely painless. Highly recommend for cosmetic dentistry!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">PV</div>
                                        <div>
                                            <h4>Priya Verma</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I’m really happy with my dental treatment. Ma’am explained everything clearly and made sure I was comfortable throughout the procedure. I went there for scaling and cleaning, results were great."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">YM</div>
                                        <div>
                                            <h4>Yash Mahishwal</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I had a fantastic experience at Vital Dental! The staff was welcoming and professional. Dr. Pragati was thorough, explaining everything clearly and ensuring I felt no discomfort."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">LC</div>
                                        <div>
                                            <h4>Lalit Chauhan</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"Dr. Pragati takes her time to explain every single step. For someone who is terrified of needles, the local anesthesia was completely painless. Highly recommend for cosmetic dentistry!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">PV</div>
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
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I had awesome experience from Vital Dental Care. Dr. Pragati is very humble, polite & knowledgeable. I got totally painless RCT. Clinic is very hygienic & fully equipped!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">NS</div>
                                        <div>
                                            <h4>Neha Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"I had very informative & knowledgeable consultation from Vital Dental Care. Dr. Pragati explained everything in detail regarding my RCT & Bridge. I am very satisfied with my treatment!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">NS</div>
                                        <div>
                                            <h4>Neelesh Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card">
                                <blockquote>
                                    <p class="t-text">"Got my Invisalign braces from here. The clear aligners are so comfortable and the progress tracking is fantastic. Best orthodontics experience I've ever had."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">RJ</div>
                                        <div>
                                            <h4>Rohit Joshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <!-- Set 2 -->
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I had awesome experience from Vital Dental Care. Dr. Pragati is very humble, polite & knowledgeable. I got totally painless RCT. Clinic is very hygienic & fully equipped!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">NS</div>
                                        <div>
                                            <h4>Neha Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"I had very informative & knowledgeable consultation from Vital Dental Care. Dr. Pragati explained everything in detail regarding my RCT & Bridge. I am very satisfied with my treatment!"</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">NS</div>
                                        <div>
                                            <h4>Neelesh Singh</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                            <li class="testimonial-card" aria-hidden="true">
                                <blockquote>
                                    <p class="t-text">"Got my Invisalign braces from here. The clear aligners are so comfortable and the progress tracking is fantastic. Best orthodontics experience I've ever had."</p>
                                    <footer class="t-author">
                                        <div class="t-avatar">RJ</div>
                                        <div>
                                            <h4>Rohit Joshi</h4>
                                            <span>Patient</span>
                                        </div>
                                    </footer>
                                </blockquote>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

"""

new_content = re.sub(r'        <!-- Testimonials Section -->\n        <section id="testimonials" class="section">.*?</section>\n\n', new_testimonials, content, flags=re.DOTALL)

with open('e:/Vital Dental/index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("done")
