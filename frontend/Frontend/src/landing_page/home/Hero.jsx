import { Link } from "react-router-dom";
function Hero() {
  return (
    <section className="bg-gray-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          Learn Skills. Teach Skills.
          <br />
          Swap Knowledge.
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          Connect with people around the world and exchange skills for free.
          Teach what you know and learn what you love.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/signup">
            <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Product Image */}
      <div className="max-w-6xl mx-auto px-6 mt-16">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <img
            src="images/image-asset.webp"
            alt="product preview"
            className="rounded-lg w-full"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
