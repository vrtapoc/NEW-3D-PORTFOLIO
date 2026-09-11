// AboutPage.jsx
import React from "react";
import PagewithSidePanel from "../PagewithSidePanel.jsx";

const AboutPage = () => {
  return (
    <>
      <div className="title"></div>
      <PagewithSidePanel
        sections={[
          {
            imageSrc: "/images/About.png",
            title: "Introduction",
            header: "Vincent Tapoc",
            subheader: "Front End Developer / Marketing Management / Vibe Coder / Web Developer",
            content: [
              "Marketing → Development | 7+ Years Experience | 5+ Works Completed",
              "Digital marketing professional with hands-on experience in influencer partnerships, brand campaigns, and collaborations, now self-taught in web development. I build business websites and produce the promotional assets (videos, tools, and campaign materials) that help brands launch and grow their digital presence.",
              "From campaign strategy to deployment, I enjoy building tools that help brands grow, communicate clearly, and operate more efficiently.",
            ],
            variant: "profile",
          },
          {
            imageSrc: "/images/About2.png",
            title: "Guiding Principles",
            content: [
              "01. Strategy to Execution (Bridge goals to systems) — Translating business goals into scalable technical solutions that bridge marketing insight with modern development practices.",
              "02. Automation First (Less manual overhead) — Building workflows using n8n, Docker, and API integrations to streamline operations and reduce manual overhead.",
              "03. Clean Code (Maintainable systems) — Writing maintainable, well-structured code that aligns with modern industry standards for team collaboration and scalability.",
              "04. User-Centric Design (Clear & efficient) — Crafting digital experiences that communicate clearly and help brands operate efficiently while delighting users.",
            ],
          },
        ]}
      />
    </>
  );
};

export default AboutPage;
