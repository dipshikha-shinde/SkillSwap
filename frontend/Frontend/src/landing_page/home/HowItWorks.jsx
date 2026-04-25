import React from "react";
import { UserPlus, BookOpen, Handshake } from "lucide-react";

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          How It Works
        </h2>

        <p className="mt-4 text-gray-600">
          Start exchanging skills in just a few simple steps
        </p>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <UserPlus className="w-10 h-10 text-gray-800" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Create Profile
            </h3>

            <p className="mt-3 text-gray-600 text-sm">
              Join the community and create your profile to start sharing and
              learning skills.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-10 h-10 text-gray-800" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Add Your Skills
            </h3>

            <p className="mt-3 text-gray-600 text-sm">
              List the skills you can teach or the ones you want to learn.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <Handshake className="w-10 h-10 text-gray-800" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              Start Swapping
            </h3>

            <p className="mt-3 text-gray-600 text-sm">
              Connect with others and exchange knowledge without paying for
              courses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
