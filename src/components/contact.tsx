"use client";

import { contactInfo } from "@/lib/config-loader";

export function Contact() {
  return (
    <section className="quiet-tool-surface quiet-contact-surface" aria-labelledby="contact-title">
      <h2 id="contact-title">Contact</h2>
      <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
      {contactInfo.phone ? <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a> : null}
      <div>
        {contactInfo.socials.map((social) => (
          <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
            {social.name}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contact;
