import React, { useRef, useEffect, useState } from "react";

const EnhancedRoadmapComponent = ({ isDarkMode }) => {
  // State to track which phase is being hovered or selected
  const [activePhase, setActivePhase] = useState(0);
  const [clickedPhase, setClickedPhase] = useState(null);
  // State for animation on scroll
  const [visibleSections, setVisibleSections] = useState([]);

  // Refs for intersection observer
  const headerRef = useRef(null);
  const roadmapRef = useRef(null);
  const buttonRef = useRef(null);

  // Color styling based on dark/light mode
  const bgGradient = isDarkMode
    ? "bg-[#0E0B12]"
    : "bg-gradient-to-b from-[#EBEBFA] via-[#f0f1ff] to-[#EBEBFA]";
  const cardBg = isDarkMode ? "bg-[#1A1525]/90" : "bg-white/90";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const subtitleColor = isDarkMode ? "text-fuchsia-300" : "text-fuchsia-600";
  const listItemColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode
    ? "border-purple-800/30"
    : "border-purple-200/50";
  const progressLineColor = isDarkMode
    ? "bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500"
    : "bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500";
  const phaseBoxBg = isDarkMode ? "bg-[#1A1525]" : "bg-white";
  const phaseBoxActiveBg = isDarkMode ? "bg-[#231A32]" : "bg-purple-50";
  const phaseHeaderBg = isDarkMode
    ? "bg-gradient-to-r from-fuchsia-900/30 to-purple-900/30"
    : "bg-gradient-to-r from-fuchsia-100/80 to-purple-100/80";
  const phaseNumberColor = isDarkMode ? "text-fuchsia-300" : "text-fuchsia-600";
  console.log(activePhase);
  // Intersection Observer setup
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === headerRef.current) {
            setVisibleSections((prev) => [
              ...prev.filter((item) => item !== "header"),
              "header",
            ]);
          } else if (entry.target === roadmapRef.current) {
            setVisibleSections((prev) => [
              ...prev.filter((item) => item !== "roadmap"),
              "roadmap",
            ]);
          } else if (entry.target === buttonRef.current) {
            setVisibleSections((prev) => [
              ...prev.filter((item) => item !== "button"),
              "button",
            ]);
          }
        }
      });
    }, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (roadmapRef.current) observer.observe(roadmapRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Roadmap phases data
  const phases = [
    {
      title: "Phase 1: Q1 2026",
      subtitle: "Prototype Development",
      description:
        "The prototype phase is dedicated to creating and testing the core components of the Linktum AI platform.",
      items: [
        "Strategic Partnerships with Key Industry Players",
        "Technical Framework & Interactive Prototypes",
        "Community Growth & Early Adopter Program",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-fuchsia-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Phase 2: Q2 2026",
      subtitle: "Ecosystem Growth ",
      description:
        "Introducing our virtual reality marketplace with essential tools for creators and buyers.",
      items: [
        "Social Community Platforms",
        "Advanced Seller & Buyer Tools Development",
        "Creator Onboarding Program",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-fuchsia-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10C3 8.34315 4.34315 7 6 7H18C19.6569 7 21 8.34315 21 10V14C21 15.6569 19.6569 17 18 17H16L14 13H10L8 17H6C4.34315 17 3 15.6569 3 14V10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2V6M9 4L12 1L15 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Phase 3: Q3 2026",
      subtitle: "Linktum Marketplace",
      description:
        "Full marketplace rollout with advanced features and community integration.",
      items: [
        "Complete Marketplace Public Launch",
        "Advanced Analytics & Sales Dashboard",
        "Community Integration & Social Features",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-fuchsia-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 9L4 4H20L21 9M3 9H21M3 9L5 20H19L21 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 13H17M9 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Phase 4: Q4 2026",
      subtitle: "AI-Powered layer-2 Creation",
      description:
        "Integrating artificial intelligence to revolutionize 3D asset creation and display.",
      items: [
        "Full Activation of PoI and AIVM",
        "Validator and Contributor Nodes",
        "Innovation Grant Program Launch",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-fuchsia-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3V5M12 19V21M5 12H3M21 12H19M16.24 7.76L17.66 6.34M6.34 17.66L7.76 16.24M16.24 16.24L17.66 17.66M6.34 6.34L7.76 7.76M9 12A3 3 0 0 1 15 12A3 3 0 0 1 9 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Phase 5: Q1 2027",
      subtitle: "AI security Improvement & Decentralization",
      description:
        "AI Transitioning to decentralized governance and ongoing platform enhancements.",
      items: [
        "AI DAO-Based Governance Implementation",
        "Ongoing Platform Enhancements",
        "Expanded Ecosystem Integrations",
      ],
      icon: (
        <svg
          className="w-6 h-6 text-fuchsia-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="4" cy="20" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 12L4 4M12 12L20 4M12 12L4 20M12 12L20 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className={`relative w-full py-24 overflow-hidden ${bgGradient}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 blur-3xl"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/10 to-fuchsia-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-gradient-to-r from-fuchsia-500/5 to-purple-600/5 blur-3xl"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-20"
          style={{
            opacity: visibleSections.includes("header") ? 1 : 0,
            transform: visibleSections.includes("header")
              ? "translateY(0)"
              : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div className="inline-block p-2 px-5 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-purple-600/10 mb-4 transform hover:scale-105 transition-transform duration-300">
            <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-gradient-x">
              Our Vision & Development Journey
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-gradient-x">
              Linktum AI{" "}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-gradient-x">
              Roadmap
            </span>
          </h2>

          <div className="mx-auto w-32 h-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full mb-10"></div>

          <p className={`max-w-3xl mx-auto ${textSecondary} leading-relaxed`}>
            A strategic vision for building the next generation of immersive
            commerce experiences that will transform how people create, share,
            and trade digital assets
          </p>
        </div>

        {/* Roadmap Content */}
        <div
          ref={roadmapRef}
          className="mx-auto"
          style={{
            opacity: visibleSections.includes("roadmap") ? 1 : 0,
            transform: visibleSections.includes("roadmap")
              ? "translateY(0)"
              : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            transitionDelay: "0.2s",
          }}
        >
          {/* Desktop Timeline View */}
          <div className="hidden lg:block relative">
            <div
              className={`mx-auto max-w-6xl rounded-2xl ${cardBg} backdrop-blur-md border ${borderColor} shadow-xl overflow-hidden p-10`}
            >
              {/* Progress Line */}
              <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 right-0 h-2 rounded-full bg-gray-200/50"></div>
                <div className="absolute top-1/2 left-0 right-0 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${progressLineColor} rounded-full`}
                    style={{ width: "100%" }}
                  ></div>
                </div>

                {/* Phase Dots */}
                <div className="relative flex justify-between">
                  {phases.map((phase, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col items-center"
                      onMouseEnter={() => {
                        if (clickedPhase === null) setActivePhase(index);
                      }}
                      onMouseLeave={() => {
                        if (clickedPhase === null) setActivePhase(null);
                      }}
                      onClick={() => {
                        if (clickedPhase === index) {
                          setClickedPhase(null);
                          setActivePhase(null);
                        } else {
                          setClickedPhase(index);
                          setActivePhase(index);
                        }
                      }}
                    >
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-300 cursor-pointer ${
                          activePhase === index
                            ? "scale-110 shadow-purple-600/30"
                            : "shadow-purple-600/20"
                        } ${progressLineColor}`}
                      >
                        <span className="text-white font-bold text-xl">
                          {index + 1}
                        </span>
                      </div>

                      {/* Phase title above the dot */}
                      <div
                        className={`absolute -top-16 text-center transition-all duration-300 ${
                          activePhase === index ? "opacity-100" : "opacity-80"
                        }`}
                      >
                        <p
                          className={`font-semibold text-lg ${textColor} whitespace-nowrap`}
                        >
                          {phase.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Phase Details */}
              <div className="p-8 border-t border-purple-200/30">
                {activePhase !== null &&
                activePhase >= 0 &&
                activePhase < phases.length ? (
                  <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-1">
                      <div
                        className={`p-5 rounded-xl ${phaseHeaderBg} mb-4 flex items-center gap-4`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${progressLineColor}`}
                        >
                          <span className="text-white font-bold text-xl">
                            {activePhase + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold ${textColor}`}>
                            {phases[activePhase].subtitle}
                          </h3>
                          <p className={`text-sm font-medium ${subtitleColor}`}>
                            {phases[activePhase].title}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-base ${listItemColor} mb-4 leading-relaxed`}
                      >
                        {phases[activePhase].description}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <h4 className={`text-lg font-semibold ${textColor} mb-5`}>
                        Key Deliverables
                      </h4>
                      <ul className="grid grid-cols-1 gap-5">
                        {phases[activePhase].items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className={`p-4 rounded-lg ${phaseBoxBg} border ${borderColor} shadow-sm flex items-start`}
                          >
                            <div
                              className={`mr-4 p-2 rounded-lg ${phaseHeaderBg}`}
                            >
                              {phases[activePhase].icon}
                            </div>
                            <span className={`text-base ${listItemColor}`}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className={`text-lg ${textColor} mb-3`}>
                      Click on a phase number to see details
                    </p>
                    <p className={`text-base ${listItemColor}`}>
                      Our roadmap outlines the journey of FutureSyncx from
                      foundation to full decentralization.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-3 gap-6">
              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`${cardBg} rounded-xl border ${borderColor} backdrop-blur-sm shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >
                  <div className={`${progressLineColor} h-2 w-full`}></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`rounded-lg p-2 ${phaseHeaderBg}`}>
                        {phase.icon}
                      </div>
                      <span className={`font-bold text-lg ${phaseNumberColor}`}>
                        {index + 1}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold ${textColor} mb-1`}>
                      {phase.subtitle}
                    </h3>
                    <p
                      className={`text-xs ${phaseNumberColor} font-medium mb-3`}
                    >
                      {phase.title}
                    </p>

                    <ul className="space-y-2">
                      {phase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="mr-2 mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex-shrink-0"></div>
                          <span className={`text-xs ${listItemColor}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline View (Vertical) */}
          <div className="md:hidden">
            <div className="relative flex flex-col space-y-6">
              {/* Vertical Line */}
              <div className="absolute top-0 left-4 bottom-0 w-1 rounded-full bg-gray-200/50"></div>
              <div className="absolute top-0 left-4 bottom-0 w-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressLineColor} rounded-full`}
                ></div>
              </div>

              {phases.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-start relative transition-all duration-300 ${
                    activePhase === index ? "transform scale-[1.02]" : ""
                  }`}
                  onClick={() =>
                    setActivePhase(activePhase === index ? null : index)
                  }
                >
                  {/* Dot */}
                  <div
                    className={`w-8 h-8 rounded-full ${progressLineColor} flex items-center justify-center z-10 flex-shrink-0 shadow-lg shadow-purple-600/20`}
                  >
                    <span className="text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-4 ${cardBg} rounded-xl border ${
                      activePhase === index
                        ? "border-fuchsia-300/30"
                        : borderColor
                    } backdrop-blur-sm shadow-md overflow-hidden flex-grow transition-all duration-300`}
                  >
                    <div className={`${phaseHeaderBg} p-3`}>
                      <h3 className={`text-base font-bold ${textColor} mb-1`}>
                        {phase.subtitle}
                      </h3>
                      <p className={`text-xs font-medium ${subtitleColor}`}>
                        {phase.title}
                      </p>
                    </div>
                    {activePhase === index && (
                      <div className="p-4 border-t border-purple-200/30">
                        <p className={`text-sm ${listItemColor} mb-3`}>
                          {phase.description}
                        </p>
                        <ul className="space-y-2">
                          {phase.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <div className="mr-2 mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 flex-shrink-0"></div>
                              <span className={`text-xs ${listItemColor}`}>
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Button */}
        <div
          ref={buttonRef}
          className="flex justify-center mt-20"
          style={{
            opacity: visibleSections.includes("button") ? 1 : 0,
            transform: visibleSections.includes("button")
              ? "translateY(0)"
              : "translateY(20px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
            transitionDelay: "0.4s",
          }}
        >
          <a
            href="https://futuresyncx.gitbook.io/future-sync-x/distribution/roadmap"
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white shadow-lg shadow-purple-600/20 hover:shadow-xl hover:shadow-purple-600/30 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 text-white"
            >
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View Detailed Roadmap
          </a>
        </div>
      </div>

      {/* Custom styling */}
      <style jsx>{`
        /* Gradient animation */
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }

        /* Grid background pattern */
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(217, 70, 239, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(217, 70, 239, 0.1) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
};

export default EnhancedRoadmapComponent;
