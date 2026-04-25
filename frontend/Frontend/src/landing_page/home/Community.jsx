import React from "react";

function Community() {
  return (
    <section id="community" className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Trusted by learners and teachers worldwide
        </h2>

        {/* Avatars */}
        <div className="flex justify-center items-center mt-10 -space-x-4">
          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt=""
          />

          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt=""
          />

          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://randomuser.me/api/portraits/women/68.jpg"
            alt=""
          />

          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt=""
          />

          <img
            className="w-12 h-12 rounded-full border-2 border-white"
            src="https://randomuser.me/api/portraits/women/12.jpg"
            alt=""
          />
        </div>

        {/* Members count */}
        <p className="mt-6 text-gray-600">
          Join <span className="font-semibold text-gray-900">2000+</span>{" "}
          members already exchanging skills
        </p>
      </div>
    </section>
  );
}

export default Community;
