import { Link } from "react-router-dom";
function CTA() {
  return (
    <section className="bg-gray-900 py-20 text-center text-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold">
          Ready to Start Learning New Skills?
        </h2>

        {/* Description */}
        <p className="mt-4 text-gray-300">
          Join the SkillSwap community and start exchanging knowledge today.
        </p>

        {/* Button */}
        <Link to={"signup"}>
          <button className="mt-8 bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
            Create Free Account
          </button>
        </Link>
      </div>
    </section>
  );
}

export default CTA;
