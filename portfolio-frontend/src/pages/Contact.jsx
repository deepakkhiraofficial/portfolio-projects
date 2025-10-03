import React, { useState } from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/deepakkhiraofficial",
    icon: <FaLinkedin aria-hidden="true" />,
  },
  {
    name: "GitHub",
    url: "https://github.com/deepakkhiraofficial",
    icon: <FaGithub aria-hidden="true" />,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/deepakkhiraofficial/",
    icon: <FaFacebook aria-hidden="true" />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/deepakkhiraofficial/",
    icon: <FaInstagram aria-hidden="true" />,
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { name, email, message } = formData;
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all the fields.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // ✅ simple backend endpoint (no redis/queue, direct email send)
      const res = await axios.post(
        "https://deepakkhiraofficial.onrender.com/contact",
        { name, email, message},
        { headers: { "Content-Type": "application/json" } ,
          withCredentials: true,
          timeout: 10000 // 10 seconds timeout
        }
      );
        console.log(res.data)
      toast.success(res?.data?.message || "Message sent successfully!", {
        autoClose: 3000,
      });
      setFormData({ name: "", email: "", message: "" });
      document.getElementById("name").focus();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        "Failed to send message. Please try again later.";
      toast.error(errorMessage, { autoClose: 5000 });
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
          Get In Touch
        </h2>

        {/* Contact Details + Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <aside className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">
              Contact Details
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <FaEnvelope className="text-blue-500 text-xl" />
                <a
                  href="mailto:deepakkushwah475110@gmail.com"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  deepakkushwah475110@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="text-blue-500 text-xl" />
                <a
                  href="tel:+919109001109"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  +91 9109001109
                </a>
              </li>
            </ul>
          </aside>

          <aside className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">
              Connect With Me
            </h3>
            <ul className="flex flex-wrap gap-4">
              {socialLinks.map(({ name, url, icon }) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-blue-100 hover:text-blue-600 transition"
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
          <ToastContainer autoClose={3000} />
          <h3 className="text-2xl font-semibold text-blue-600 mb-6">
            Send Me a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your Message"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
