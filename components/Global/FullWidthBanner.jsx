import React from "react";
import Image from "next/image";

const FullWidthBanner = ({ isDarkMode }) => {
  return (
    <div
      className="relative w-screen overflow-hidden mb-8"
      style={{ marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* This technique breaks out of the parent container to go full-width */}
      <div
        className="w-screen"
        style={{
          position: "relative",
          // Desktop uses aspect ratio
          paddingBottom: "15%", // ~4.5:1 aspect ratio for desktop
        }}
      >
        {/* Responsive styles */}
        <style jsx>{`
          div {
            width: 100vw !important;
          }

          /* Fixed heights for tablet and mobile */
          @media (max-width: 1023px) {
            div {
              padding-bottom: 0 !important; /* Remove aspect ratio padding */
              height: 240px !important; /* Fixed height for tablet */
            }
          }

          @media (max-width: 640px) {
            div {
              padding-bottom: 0 !important; /* Remove aspect ratio padding */
              height: 180px !important; /* Fixed height for mobile */
            }
          }
        `}</style>

        <Image
          src={isDarkMode ? "/dashboard.png" : "/dashboard-light.png"}
          alt={"Wave Background"}
          fill
          priority={true}
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center bottom",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

export default FullWidthBanner;
