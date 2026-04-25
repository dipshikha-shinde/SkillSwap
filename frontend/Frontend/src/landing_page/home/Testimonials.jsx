import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reviews/latest`);
        const data = await response.json();

        if (response.ok) {
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          What Our Users Say
        </h2>

        <p className="mt-4 text-gray-600">
          Reviews from learners after completing skill sessions
        </p>

        {reviews.length === 0 ? (
          <p className="mt-10 text-gray-500">No reviews available yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {reviews.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <p className="text-yellow-600 font-medium text-sm mb-3">
                  ⭐ {item.rating} / 5
                </p>

                <p className="text-gray-600 text-sm leading-relaxed">
                  "{item.comment}"
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <img
                    src={
                      item.reviewer?.profileImage?.trim()
                        ? item.reviewer.profileImage
                        : "https://via.placeholder.com/50"
                    }
                    alt={item.reviewer?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      {item.reviewer?.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Reviewed {item.teacher?.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
