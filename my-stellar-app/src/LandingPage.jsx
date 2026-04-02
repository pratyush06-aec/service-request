import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LandingPage({ onLaunch }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();
      
      tl.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
      .from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.6")
      .from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5")
      .from(cardsRef.current, {
        y: 100,
        opacity: 0,
        rotationX: 45,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.4");

      // 3D Tilt Effect on Cards
      cardsRef.current.forEach(card => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -15;
          const rotateY = ((x - centerX) / centerX) * 15;
          
          gsap.to(card, {
            rotationX,
            rotationY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: "power3.out",
            duration: 0.5
          });
        });
      });

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleLaunchClick = () => {
    // Exit animation
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      scale: 0.95,
      duration: 0.6,
      ease: "power3.in",
      onComplete: onLaunch
    });
  };

  return (
    <div className="landing-container" ref={containerRef}>
      <div className="landing-content">
        <h1 ref={titleRef} className="landing-title">
          Stellar <span className="text-gradient">Service</span> Network
        </h1>
        <p ref={subtitleRef} className="landing-subtitle">
          A decentralized hub for service requesters and providers. 
          Manage bounties, accept jobs, and process approvals entirely on-chain.
        </p>
        
        <div ref={buttonsRef} className="landing-actions">
          <button className="btn-launch" onClick={handleLaunchClick}>
            Enter Dashboard <span className="btn-icon">→</span>
          </button>
        </div>

        <div className="feature-cards">
          <div className="feature-card glass-panel" ref={el => cardsRef.current[0] = el}>
            <div className="icon">📝</div>
            <h3>Create Requests</h3>
            <p>Post your requirements, specify the priority, and set the budget in stroops.</p>
          </div>
          <div className="feature-card glass-panel" ref={el => cardsRef.current[1] = el}>
            <div className="icon">🤝</div>
            <h3>Accept & Submit</h3>
            <p>Service providers can seamlessly accept open requests and submit work deliverables.</p>
          </div>
          <div className="feature-card glass-panel" ref={el => cardsRef.current[2] = el}>
            <div className="icon">⛓️</div>
            <h3>On-chain Approval</h3>
            <p>Requesters verify deliverables and approve jobs transparently on the Soroban network.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
