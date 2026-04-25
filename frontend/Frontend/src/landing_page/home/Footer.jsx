import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Footer */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Logo + Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">SkillSwap</h2>

            <p className="mt-3 text-gray-600 text-sm">
              A community platform where people exchange skills and learn from
              each other without paying for courses.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 text-gray-700">
            <a href="#explore" className="hover:text-black">
              Explore Skills
            </a>

            <a href="#how" className="hover:text-black">
              How It Works
            </a>

            <a href="#community" className="hover:text-black">
              Community
            </a>

            <a href="#about" className="hover:text-black">
              About
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Github className="cursor-pointer hover:text-black" />

            <Twitter className="cursor-pointer hover:text-black" />

            <Linkedin className="cursor-pointer hover:text-black" />
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">Built by Dipshikha Shinde</p>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          © 2026 SkillSwap. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
