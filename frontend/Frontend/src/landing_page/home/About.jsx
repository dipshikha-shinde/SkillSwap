import React from "react";

function About() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div>
          <img
            src="images/aboutimage.jpg"
            alt="community learning"
            className="rounded-xl shadow-md"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            About SkillSwap
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed">
            SkillSwap is a community-driven platform where people exchange
            knowledge instead of paying for expensive courses. Whether you want
            to learn coding, photography, music, or design — you can connect
            with someone who already knows it.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Teach what you know and learn what you love while building
            meaningful connections with people around the world.
          </p>

          {/* Benefits */}
          <div className="mt-6 space-y-3 text-gray-700">
            <p>✔ Learn without expensive courses</p>
            <p>✔ Share your skills with others</p>
            <p>✔ Build a global learning community</p>
          </div>

          {/* Button */}
          <button className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
