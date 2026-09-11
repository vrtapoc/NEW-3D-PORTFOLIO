// ProjectExperiencePage.jsx
import React from "react";
import PagewithSidePanel from "../PagewithSidePanel.jsx";

const ProjectsPage = () => {
  return (
    <>
      <div className="title"></div>
      <PagewithSidePanel
        sections={[
          {
            title: "Selected Experience",
            content:
              "A collection of projects and roles spanning web development, marketing partnerships, and automation pipelines. Each entry highlights the core objective, technology stack, and business impact.",
          },
          {
            title: "Tee Streets",
            subheader: "Automation   ·   Video Editing   ·   Social Media",
            content: [
              "Video-to-Social Automation — Building an end-to-end content pipeline that takes raw footage, auto-edits it into platform-ready cuts, and publishes across social channels with minimal manual steps. Focused on faster turnaround from shoot to post.",
            ],
          },
          {
            title: "Liz Taiwan Stay",
            subheader: "Web Design   ·   Base44   ·   Airbnb",
            content: [
              "Dadaocheng Stay — An interactive, scroll-based concept redesign for a Taipei Airbnb listing, reimagining a static booking page as a cinematic neighborhood-to-room narrative. Built in Base44 using real location data and the host's actual listing details.",
            ],
            buttons: [
              {
                label: "Website",
                href: "https://liz-taiwan-stay.base44.app",
              },
            ],
          },
          {
            title: "Celestins Agency",
            subheader: "Marketing   ·   Partnerships   ·   Lead Gen",
            content: [
              "B2B Lead Generation & Partnerships — Built influencer partnerships and drove B2B lead generation for a growing marketing agency, connecting brand strategy with measurable audience growth.",
            ],
          },
          {
            title: "Boo Enterprises Inc.",
            subheader: "Brand Deals   ·   Campaigns   ·   Content",
            content: [
              "Brand Partnership & Campaign Management — Managed brand partnership programs and creative campaigns, helping coordinate campaigns that connected businesses with relevant audiences and content opportunities.",
            ],
          },
          {
            title: "Thinksanity NFT",
            subheader: "Community   ·   Content   ·   Engagement",
            content: [
              "Community Management & Growth — Grew and moderated an NFT community while managing content and partnerships to maintain engagement and strengthen community trust.",
            ],
          },
          {
            title: "Dap Props LLC",
            subheader: "Operations   ·   Client Support   ·   Marketing",
            content: [
              "Operations & Client Coordination — Supported property operations and client-facing coordination while creating marketing materials that improved communication and presentation.",
            ],
          },
        ]}
      />
    </>
  );
};

export default ProjectsPage;
