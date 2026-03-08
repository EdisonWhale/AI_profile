'use client';

import { ChevronRight } from 'lucide-react';
import { contactInfo } from '@/lib/config-loader';

export function Contact() {
  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/5 w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12 hover:bg-white/80 transition-all duration-300">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contacts
          </h2>
          <span className="mt-2 sm:mt-0">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <a
            className="group mb-5 inline-block"
            href={`mailto:${contactInfo.email}`}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </a>

          {/* Phone Section */}
          {contactInfo.phone && (
            <a
              className="group mb-5 inline-block"
              href={`tel:${contactInfo.phone}`}
            >
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-green-500 hover:underline sm:text-lg">
                  {contactInfo.phone}
                </span>
                <ChevronRight className="h-5 w-5 text-green-500 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </a>
          )}

          {/* Social Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
            {contactInfo.socials.map((social) => (
              <a
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
