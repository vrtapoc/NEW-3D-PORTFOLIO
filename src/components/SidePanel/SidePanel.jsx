// SidePanel.jsx
import React, { useRef, useEffect, useState } from "react";
import "./SidePanel.scss";
import { useUiStore } from "../../stores/uiStore";
import { useToggleRoomStore } from "../../stores/toggleRoomStore";
import gsap from "gsap";
import { useNavigate } from "react-router";
import { useResponsiveStore } from "../../stores/useResponsiveStore";
import "../../pages/Contacts/ContactsPage.jsx";

const SidePanel = ({ sections = [] }) => {
  const { isPanelOpen, closePanel } = useUiStore();
  const { isDarkRoom } = useToggleRoomStore();
  const { isMobile } = useResponsiveStore();
  const panelRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Initial positioning depending on mobile/desktop
  useEffect(() => {
    if (!panelRef.current) return;

    if (isMobile) {
      if (isPanelOpen) {
        gsap.set(panelRef.current, { x: 0, y: 0 });
      } else {
        gsap.set(panelRef.current, { x: 0, y: "100%" });
      }
    } else {
      if (isPanelOpen) {
        gsap.set(panelRef.current, { x: 0, y: 0 });
      } else {
        closePanel();
        gsap.set(panelRef.current, { x: "100%", y: 0 });
      }
    }
  }, [isMobile]);

  // Open/close animation
  useEffect(() => {
    if (!panelRef.current) return;

    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    if (!isMobile) {
      if (isPanelOpen) {
        gsap.to(panelRef.current, {
          x: 0,
          duration: 1,
          onComplete: () => {
            console.log("Panel opened");
          },
        });
      } else {
        gsap.to(panelRef.current, {
          x: "100%",
          duration: 1,
          onComplete: () => {
            navigate("/");
            console.log("Panel closed");
          },
        });
      }
    } else {
      if (isPanelOpen) {
        gsap.to(panelRef.current, {
          y: 0,
          duration: 1,
          onComplete: () => {
            console.log("Panel opened");
          },
        });
      } else {
        gsap.to(panelRef.current, {
          y: "100%",
          duration: 0.5,
          onComplete: () => {
            navigate("/");
            console.log("Panel closed");
          },
        });
      }
    }
  }, [isPanelOpen, isMobile, navigate, isInitialized]);

  return (
    <>
      <div
        className={`overlay ${isPanelOpen ? "open" : ""}`}
        onClick={closePanel}
      />

      <div
        ref={panelRef}
        className={`side-panel ${isPanelOpen ? "open" : ""} ${
          isDarkRoom ? "dark-mode" : "light-mode"
        }`}
      >
        <button onClick={closePanel} className="close-button">
          ✕
        </button>

        <div className="side-panel-content">
          {sections.map((section, index) => (
            <div
              className={`side-panel-section ${
                section.variant === "profile" ? "side-panel-section--profile" : ""
              }`}
              key={index}
            >
              {section.imageSrc && (
                <div className="side-panel-full-image">
                  <img
                    src={section.imageSrc}
                    className="side-panel-image"
                    alt={section.title || section.header || `panel-section-${index}`}
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchpriority={index === 0 ? "high" : "auto"}
                  />
                </div>
              )}

              {/* Only render side-panel-text if there is text-related content */}
              {(section.title ||
                section.header ||
                section.subheader ||
                (section.buttons && section.buttons.length > 0) ||
                section.resumeHref ||
                section.content) && (
                  <div className="side-panel-text">
                    {/* === TITLE + HEADER/RESUME + SUBHEADER + PROJECT BUTTONS === */}
                    {(section.title ||
                      section.header ||
                      section.subheader ||
                      (section.buttons && section.buttons.length > 0) ||
                      section.resumeHref) && (
                      <div className="section-top-row">
                        {/* LEFT: title + header + subheader */}
                        <div className="section-heading">
                          {/* Title with yellow bar only on first section */}
                          {section.title && (
                            <h1
                              className={`panel-header ${
                                index === 0 ? "panel-header--with-bar" : ""
                              }`}
                            >
                              {section.title}
                            </h1>
                          )}

                          {/* HEADER ROW: Name + Resume button (About page) */}
                          {(section.header || section.resumeHref) && (
                            <div className="section-header-row">
                              {section.header && (
                                <h2 className="section-header">
                                  {section.header}
                                </h2>
                              )}

                              {section.resumeHref && (
                                <div className="resume-button-wrapper">
                                  <a
                                    href={section.resumeHref}
                                    className="resume-button"
                                    download
                                  >
                                    Download Résumé
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Subheader (role / tech stack / etc.) */}
                          {section.subheader &&
                            !Array.isArray(section.subheader) && (
                              <p className="section-subheader">
                                {section.subheader}
                              </p>
                            )}

                          {Array.isArray(section.subheader) && (
                            <div className="section-subheader section-subheader--tags">
                              {section.subheader.map((tech, i) => (
                                <span className="tech-pill" key={i}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      {/* RIGHT: optional project buttons (Live Demo / GitHub) */}
                        {section.buttons &&
                          Array.isArray(section.buttons) &&
                          section.buttons.length > 0 && (
                            <div className="section-buttons section-buttons--inline">
                              {section.buttons.map((btn, i) => (
                                <a
                                  key={i}
                                  href={btn.href}
                                  className="project-button"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {btn.label}
                                </a>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {/* CONTENT: string or array of strings */}
                    {section.content && !Array.isArray(section.content) && (
                      <p className="panel-content-description">
                        {section.content}
                      </p>
                    )}

                    {Array.isArray(section.content) &&
                      section.content.map((block, i) => (
                        <p className="panel-content-description" key={i}>
                          {block}
                        </p>
                      ))}
                  </div>
              )}

              {/* ICON HEADER + ICON ROW (SKILLS / CONTACTS) – dedicated fields */}
              {(section.iconHeader || section.icons) && (
                <div className="skills-icon-row-wrapper">
                  {section.iconHeader && (
                    <h3 className="skills-icon-header">
                      {section.iconHeader}
                    </h3>
                  )}

                  {/* Optional description below header */}
                  {section.iconDescription && (
                    <p className="panel-content-description">
                      {section.iconDescription}
                    </p>
                  )}

                  {section.icons && Array.isArray(section.icons) && (
                    <div className="skills-icon-row">
                      {section.icons.map((icon, i) => {
                        const Wrapper = icon.href ? "a" : "div";

                        return (
                          <div className="skill-icon-item" key={i}>
                            <Wrapper
                              href={icon.href}
                              className={icon.href ? "skill-icon-link" : undefined}
                              target={
                                icon.href?.startsWith("http") ? "_blank" : undefined
                              }
                              rel={
                                icon.href?.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                            >
                              <div className="skill-icon-svg">
                                {icon.svg}
                              </div>
                            </Wrapper>

                            <div className="skill-label">
                              {icon.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {/* 📨 OPTIONAL CONTACT FORM */}
              {section.contactForm && (
                <div className="side-panel-form-wrapper">
                  <div className="side-panel-form-inner">
                    <div className="side-panel-form-contents"> 
                    {section.contactForm.title && (
                      <h3 className="panel-header">
                        {section.contactForm.title}
                      </h3>
                    )}

                    {section.contactForm.description && (
                      <p className="panel-content-description">
                        {section.contactForm.description}
                      </p>
                    )}

                    <form
                      ref={section.contactForm.formRef}
                      className="side-panel-form"
                      onSubmit={section.contactForm.onSubmit}
                    >
                      {/* Name */}
                      <div className="side-panel-form-field">
                        <input
                          id="contact-name"
                          name="user-name"
                          type="text"
                          required = "required"
                        />
                        <span>Full Name</span>
                      </div>

                      {/* Email */}
                      <div className="side-panel-form-field">
                        <input
                          id="contact-email"
                          name="user-email"
                          type="email"
                          required = "required"
                        />
                        <span>Email Address</span>
                      </div>

                      {/* Message */}
                      <div className="side-panel-form-field">
                        <textarea
                          id="contact-message"
                          name="user-message"
                          rows="2"
                          required = "required"
                        />
                        <span>Enter your message..</span>
                      </div>

                      <button type="submit" className="project-button">
                        Submit
                      </button>
                    </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
