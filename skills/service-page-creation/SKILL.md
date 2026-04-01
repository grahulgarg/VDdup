---
name: Vital Dental - Service Page Creation
description: Standard Operating Procedure for creating localized, SEO-optimized service pages for Vital Dental Care and Implant Center.
---
# Vital Dental - Service Page Creation Skill

## 1. Project Context & Brand Guidelines
- **Clinic Name:** Vital Dental Care and Implant Center
- **Lead Dentist:** Dr. Pragati Singh
- **Target Location:** Dehradun (Specific areas: Kanwali, GMS Road, Engineers Enclave, Haripuram Colony)
- **Address:** Haripuram Colony, 2, GMS Rd, Engineers Enclave, Kanwali, Dehradun, Uttarakhand 248001
- **Contact:** +91 92868 98353
- **Brand Tone:** Empathetic, simple, precise, highly informative, and reassuring. Focus heavily on "painless" treatments, "hygiene," and "advanced technology."

## 2. SEO & Technical Requirements
Every new page must strictly adhere to the following standards:
- **Global Head Terms:** Naturally weave the phrases **"Best Dentist in Dehradun"** and **"Best Dental Clinic in Dehradun"** into the content, meta descriptions, or footer of every page where contextually appropriate.
- **Routing:** Use clean, descriptive URLs (e.g., `/services/pediatric-dentistry`).
- **Meta Data:** 
  - `Title`: Under 60 characters. Must include the core service and "Dehradun". (e.g., "Best Pediatric Dentist in Dehradun | Vital Dental")
  - `Description`: Under 160 characters. Must include "Dr. Pragati Singh", "GMS Road/Kanwali", and a strong call-to-action (CTA).
- **Schema Markup:** Inject `MedicalWebPage`, `LocalBusiness` (or `Dentist`), and `FAQPage` JSON-LD into the `<head>` of every page.
- **Component Architecture:** Use the existing design system (Tailwind CSS, Next.js/React components). Ensure responsive design (mobile-first).
- **Internal Linking:** Ensure the new route is added to the main navigation menu and the `/services` overview page. Link back to the homepage using the anchor text "Best Dental Clinic in Dehradun".

## 3. Page Structure (Standard Operating Procedure)
Each service page must contain a minimum of 500 words and follow this exact layout:
1. **Hero Section:** 
   - `H1` containing the main service keyword + Dehradun (e.g., "Painless Tooth Extraction in Dehradun").
   - 2-3 lines of reassuring subtext.
   - Primary CTA Button ("Book Appointment").
2. **Introduction:** Simple explanation of the service. Bridge the gap between clinical terminology and patient understanding.
3. **Specific Treatments Offered (`H2`):** A breakdown of the exact clinical services (use the "Remaining Services Matrix" below to populate this).
4. **Why Choose Dr. Pragati Singh (`H2`):** Reiterate local authority, position her as the "Best Dentist in Dehradun," and highlight pain-free approach and clinic amenities.
5. **Patient FAQs (`H2`):** Accordion-style FAQ with 3-5 common patient questions specific to the treatment.
6. **Footer/CTA:** Address, map link, and contact details.

## 4. Remaining Services Matrix (Source of Truth)
When prompted to build a specific page, pull the sub-services strictly from this list:

### A. Core Authority Pages (Homepage & About)
- **Target URL:** `/` (Homepage) and `/about`
- **Keywords:** Best dentist in Dehradun, best dental clinic in Dehradun, top dental implant center GMS road, Dr. Pragati Singh.
- **Focus:** E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). Highlight clinic amenities, Google 5-star reviews, and comprehensive care. Use `Dentist` schema instead of generic `LocalBusiness`.

### B. Pediatric Dentistry (Kids' Dental Care)
- **Target URL:** `/services/pediatric-dentistry`
- **Keywords:** Best pediatric dentist Dehradun, child-friendly dental clinic GMS road, kids tooth extraction.
- **Clinical Sub-Services:** Extraction of milk tooth, Endodontic treatment (milk tooth), Preformed Metal Crowns, Space Maintainers (One quadrant), Myofunctional appliances, Fluoride therapy, Habit breaking appliance.

### C. Oral Surgery & Extractions
- **Target URL:** `/services/oral-surgery-extractions`
- **Keywords:** Painless wisdom tooth removal Dehradun, safe tooth extraction Kanwali, oral surgeon near me, dry socket treatment.
- **Clinical Sub-Services:** Extraction (Anterior, Premolar, Molar), Wisdom/Impacted tooth extraction (Upper & Lower), Cyst removal, Bone plating for fracture reduction, TMJ relocation (non-surgical), Frenectomy, Interdental wiring/splinting, Apicectomy, Surgical exposure of tooth, Treatment of Dry socket.

### D. Prosthodontics (Crowns, Bridges & Dentures)
- **Target URL:** `/services/dental-crowns-dentures`
- **Keywords:** Best zirconia crowns Dehradun, affordable complete dentures, tooth cap fixing near me, PFM crowns.
- **Clinical Sub-Services:** Provisional Acrylic Crown, Indirect Ceramic Veneer, PFM Crown (Vita), Zircon + Ceramic/Monolith Crown, Co-Cr Metal Crown, Complete Dentures (Upper/Lower/Both), Flexible/Cast/Acrylic Partial Dentures, Clear Night Guard.

### E. Cosmetic Dentistry & Restorations
- **Target URL:** `/services/cosmetic-fillings`
- **Keywords:** Smile makeover clinic Dehradun, teeth gap filling, tooth colored fillings, best dental veneers.
- **Clinical Sub-Services:** Temporary/GIC Restoration, Composite Restoration (One/Two/Three surface), Pit & Fissure Sealant, Direct composite veneer, Fiber Post Bonding.

### F. Periodontal Therapy (Gum Care & Cleaning)
- **Target URL:** `/services/teeth-cleaning-gum-care`
- **Keywords:** Professional teeth cleaning Dehradun, bleeding gums treatment, loose teeth splinting, scaling and polishing.
- **Clinical Sub-Services:** Oral Prophylaxis (Upper & Lower jaw), Flap Surgery (Quadrant/Full mouth), Curettage (2-3 teeth region), Splinting of teeth (3-6 teeth), Gingivectomy (Quadrant).

## 5. Execution Command
When the user says "Build the [Service Name] page", automatically:
1. Scaffold the file structure.
2. Write the localized, SEO-optimized copy based on the matrix above, ensuring "Best Dentist in Dehradun" and "Best Dental Clinic in Dehradun" are naturally included.
3. Apply the Schema and Meta tags.
4. Run a build check.
5. Commit with message `feat: add localized SEO page for [Service Name]`.
