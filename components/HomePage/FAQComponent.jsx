import React, { useState } from "react";

const FAQComponent = ({ isDarkMode }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqItems = [
    {
      question: "What is Linktum AI and its core mission?",
      answer:
        "Linktum AI is a cutting-edge blockchain ecosystem powered by artificial intelligence. Our mission is to revolutionize decentralized applications and governance through innovations like PoI Consensus, the Artificial Intelligence Virtual Machine (AIVM), and a Transparent AI Framework. We aim to create a smarter, more secure, and equitable blockchain ecosystem for all.",
    },
    {
      question: "What makes Linktum AI’s PoI Consensus unique?",
      answer:
        "The Proof-of-Intelligence (PoI) Consensus leverages AI to validate transactions, ensuring both efficiency and scalability. Unlike traditional consensus models, PoI focuses on intelligent, adaptive problem-solving, reducing energy consumption while enhancing network security and throughput.",
    },
    {
      question:
        "How does the Artificial Intelligence Virtual Machine (AIVM) work?",
      answer:
        "The AIVM is a transformative environment for deploying decentralized applications (dApps) powered by AI. It integrates intelligent computing capabilities directly into the blockchain, enabling developers to create advanced, data-driven applications with seamless execution and enhanced functionality.",
    },
    {
      question: "What are the details of the Linktum AI presale?",
      answer:
        "The Linktum AI presale offers early adopters the opportunity to purchase tokens before the public launch. Participants benefit from discounted prices and exclusive perks, such as governance voting rights and priority access to ecosystem features like the Memecoin Launchpad.",
    },
    {
      question: "How does Linktum AI ensure transparency in its ecosystem?",
      answer:
        "Our Transparent AI Framework ensures every AI decision-making process is auditable and explainable. By embedding accountability into the system, we foster trust and reliability, empowering users and developers to confidently interact with Linktum AI’s technology.",
    },
    {
      question: "What role does decentralized governance play in Linktum AI?",
      answer:
        "Decentralized governance is at the heart of Linktum AI. Token holders can actively participate in decision-making processes, proposing and voting on key initiatives. This ensures the ecosystem evolves in alignment with community values while leveraging AI to streamline governance operations.",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const bgGradient = isDarkMode
    ? "bg-gradient-to-b from-[#0F0B13] to-[#0A080D]"
    : "bg-gradient-to-b from-[#f3f3f7] to-[#eaeaf0]";

  const cardBg = isDarkMode ? "bg-[#14101A]/80" : "bg-white/70";

  const questionBg = isDarkMode ? "bg-[#181320]" : "bg-white";

  const answerBg = isDarkMode ? "bg-[#14101A]" : "bg-gray-50";

  const borderColor = isDarkMode ? "border-gray-800/20" : "border-gray-200/50";

  const textGradient =
    "bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600";

  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-600";

  // Icons for open and close states
  const ChevronDown = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 transition-transform duration-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <div id="FAQ" className={`w-full py-20 ${bgGradient}`}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header with animation */}
        <div className="text-center mb-16">
          <div className="inline-block p-1.5 px-3 rounded-full bg-gradient-to-r from-teal-400/10 to-indigo-500/10 mb-4">
            <p className={`text-sm font-medium ${textGradient}`}>FAQ</p>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold ${textGradient} mb-6`}>
            Frequently Asked Questions
          </h2>
          <p
            className={`max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Everything you need to know about The Blockchain AI and our
            ecosystem
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center mt-8">
            <div className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full"></div>
          </div>
        </div>

        {/* FAQ Accordion - styled version */}
        <div className="space-y-5">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-500 ${cardBg} backdrop-blur-sm border ${borderColor} shadow-lg ${
                  isOpen ? "shadow-indigo-500/10" : ""
                }`}
              >
                <button
                  className={`w-full px-6 py-5 text-left flex justify-between items-center ${questionBg} transition-all duration-300 ${
                    isOpen ? "border-b border-gray-800/10" : ""
                  }`}
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-lg font-semibold ${
                      isOpen
                        ? textGradient
                        : isDarkMode
                        ? "text-white"
                        : "text-gray-800"
                    } pr-4`}
                  >
                    {item.question}
                  </span>

                  <div
                    className={`flex-shrink-0 rounded-full p-2 ${
                      isOpen
                        ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white"
                        : isDarkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    } transition-all duration-300 transform ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`p-6 ${answerBg} ${textSecondary} leading-relaxed`}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 backdrop-blur-sm border border-teal-400/20 text-center">
          <h3 className={`text-xl font-bold ${textGradient} mb-4`}>
            Still have questions?
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            If you couldn't find the answer to your question, feel free to reach
            out to our support team.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
