import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

function Community() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState(["All"]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [postForm, setPostForm] = useState({
    topic: "",
    text: "",
  });
  const [replyTexts, setReplyTexts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  const [editingPostId, setEditingPostId] = useState("");
  const [editingPostData, setEditingPostData] = useState({
    topic: "",
    text: "",
  });

  const [editingReplyId, setEditingReplyId] = useState("");
  const [editingReplyText, setEditingReplyText] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(savedUser || null);
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/community/topics`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch topics");
      }

      setTopics(Array.isArray(data) ? data : ["All"]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedTopic && selectedTopic !== "All") {
        params.append("topic", selectedTopic);
      }

      if (sortBy) {
        params.append("sort", sortBy);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/community?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch community posts");
      }

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTopic, sortBy]);

  const handlePostChange = (e) => {
    setPostForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      toast.success("Post created successfully");
      setPostForm({ topic: "", text: "" });
      fetchTopics();
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReplyTextChange = (postId, value) => {
    setReplyTexts((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleReplySubmit = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const text = replyTexts[postId];

      if (!text || !text.trim()) {
        return toast.error("Reply cannot be empty");
      }

      const response = await fetch(`${API_BASE_URL}/api/community/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add reply");
      }

      toast.success("Reply added");
      setReplyTexts((prev) => ({
        ...prev,
        [postId]: "",
      }));
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/community/${postId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update like");
      }

      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isLikedByCurrentUser = (post) => {
    if (!currentUser || !post.likes) return false;
    return post.likes.some(
      (id) => id === currentUser.id || id === currentUser._id
    );
  };

  const isMyItem = (authorId) => {
    if (!currentUser) return false;
    return authorId === currentUser.id || authorId === currentUser._id;
  };

  const startEditPost = (post) => {
    setEditingPostId(post._id);
    setEditingPostData({
      topic: post.topic,
      text: post.text,
    });
  };

  const handleUpdatePost = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/community/post/${editingPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingPostData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post");
      }

      toast.success("Post updated");
      setEditingPostId("");
      setEditingPostData({ topic: "", text: "" });
      fetchTopics();
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/community/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      toast.success("Post deleted");
      fetchTopics();
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEditReply = (reply) => {
    setEditingReplyId(reply._id);
    setEditingReplyText(reply.text);
  };

  const handleUpdateReply = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/community/reply/${editingReplyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: editingReplyText }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update reply");
      }

      toast.success("Reply updated");
      setEditingReplyId("");
      setEditingReplyText("");
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/community/reply/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete reply");
      }

      toast.success("Reply deleted");
      fetchPosts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;

    const term = searchTerm.toLowerCase();

    return posts.filter((post) => {
      const topicMatch = post.topic?.toLowerCase().includes(term);
      const textMatch = post.text?.toLowerCase().includes(term);
      const authorMatch = post.author?.name?.toLowerCase().includes(term);
      const replyMatch = (post.replies || []).some(
        (reply) =>
          reply.text?.toLowerCase().includes(term) ||
          reply.author?.name?.toLowerCase().includes(term)
      );

      return topicMatch || textMatch || authorMatch || replyMatch;
    });
  }, [posts, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
          <p className="text-gray-500 mt-2">
            Ask questions, discuss skills, and learn from everyone.
          </p>

          <form onSubmit={handleCreatePost} className="mt-6 space-y-4">
            <input
              type="text"
              name="topic"
              placeholder="Topic (e.g. Java, Photography, Fitness)"
              value={postForm.topic}
              onChange={handlePostChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              required
            />

            <textarea
              name="text"
              placeholder="Write your post..."
              value={postForm.text}
              onChange={handlePostChange}
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              required
            />

            <button
              type="submit"
              className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Post to Community
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Discussion Feed
              </h2>

              <div className="flex flex-col md:flex-row gap-3">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3"
                >
                  <option value="recent">Most Recent</option>
                  <option value="liked">Most Liked</option>
                </select>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by topic, post, reply, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <p className="text-gray-500">
                No community posts matched your search.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        post.author?.profileImage?.trim()
                          ? post.author.profileImage
                          : "https://via.placeholder.com/50"
                      }
                      alt={post.author?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {post.author?.name}
                      </p>
                      <p className="text-sm text-gray-500">{post.topic}</p>
                    </div>
                  </div>

                  {isMyItem(post.author?._id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditPost(post)}
                        className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingPostId === post._id ? (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={editingPostData.topic}
                      onChange={(e) =>
                        setEditingPostData((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    />
                    <textarea
                      value={editingPostData.text}
                      onChange={(e) =>
                        setEditingPostData((prev) => ({
                          ...prev,
                          text: e.target.value,
                        }))
                      }
                      rows="4"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdatePost}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingPostId("");
                          setEditingPostData({ topic: "", text: "" });
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {post.text}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(post._id)}
                    className={`px-4 py-2 rounded-lg border transition ${
                      isLikedByCurrentUser(post)
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isLikedByCurrentUser(post) ? "Liked" : "Like"} (
                    {post.likes?.length || 0})
                  </button>

                  <p className="text-sm text-gray-500">
                    {post.replies?.length || 0} replies
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">
                    Replies
                  </h3>

                  {post.replies?.length === 0 ? (
                    <p className="text-sm text-gray-500">No replies yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {post.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  reply.author?.profileImage?.trim()
                                    ? reply.author.profileImage
                                    : "https://via.placeholder.com/40"
                                }
                                alt={reply.author?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <p className="font-medium text-gray-900">
                                {reply.author?.name}
                              </p>
                            </div>

                            {isMyItem(reply.author?._id) && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEditReply(reply)}
                                  className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReply(reply._id)}
                                  className="text-sm px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          {editingReplyId === reply._id ? (
                            <div className="mt-3 space-y-3">
                              <textarea
                                value={editingReplyText}
                                onChange={(e) =>
                                  setEditingReplyText(e.target.value)
                                }
                                rows="3"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3"
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={handleUpdateReply}
                                  className="bg-black text-white px-4 py-2 rounded-lg"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingReplyId("");
                                    setEditingReplyText("");
                                  }}
                                  className="border border-gray-300 px-4 py-2 rounded-lg"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-3 text-gray-700">{reply.text}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyTexts[post._id] || ""}
                      onChange={(e) =>
                        handleReplyTextChange(post._id, e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                    />

                    <button
                      onClick={() => handleReplySubmit(post._id)}
                      className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
