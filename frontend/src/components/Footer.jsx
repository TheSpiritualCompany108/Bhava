// import React from "react";
// import { Link } from "react-router-dom";
// import styles from "./Footer.module.css";

// const InstagramIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//     <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//     <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//   </svg>
// );

// const FacebookIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//   </svg>
// );

// const LinkedInIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
//     <rect x="2" y="9" width="4" height="12" />
//     <circle cx="4" cy="4" r="2" />
//   </svg>
// );

// const YouTubeIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
//     <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
//   </svg>
// );

// function Footer() {
//   const footerColumns = [
//     {
//       heading: "Bhava: Store",
//       links: ["Shop All Products", "Collections", "Gift Sets", "Memberships"],
//     },
//     {
//       heading: "Sacred Resources",
//       links: ["Vedic Blog", "Rituals Guide", "Temple Partners", "Community"],
//     },
//     {
//       heading: "About Bhava:",
//       links: ["Our Mission", "Sustainability", "Partnerships", "Careers", "Contact Us", "FAQ"],
//     },
//   ];

//   const socialLinks = [
//     {
//       name: "Instagram",
//       icon: InstagramIcon,
//       href: "https://www.instagram.com/thespiritualcompany108?utm_source=qr&igsh=MXUxbDJ1a2NjYTl6aw==",
//     },
//     {
//       name: "Facebook",
//       icon: FacebookIcon,
//       href: "https://www.facebook.com/share/1CEvNyahhT/",
//     },
//     {
//       name: "LinkedIn",
//       icon: LinkedInIcon,
//       href: "https://www.linkedin.com/company/the-spiritual-company/",
//     },
//     {
//       name: "YouTube",
//       icon: YouTubeIcon,
//       href: "https://youtube.com/@thespiritualcompany?si=MYR68OVf3RPV94NE",
//     },
//   ];

//   return (
//     <footer className={styles.footerSection}>

//       <div className={styles.footerContainer}>
//         {footerColumns.map((column, index) => (
//           <div key={index} className={styles.footerColumn}>
//             <h3 className={styles.footerHeading}>{column.heading}</h3>
//             <ul className={styles.footerLinks}>
//               {column.links.map((link, linkIndex) => (
//                 <li key={linkIndex}>
//                   {link === "Contact Us" ? (
//                     <Link to="/contact" className={styles.contactLink}>{link}</Link>
//                   ) : link === "FAQ" ? (
//                     <Link to="/faq" className={styles.contactLink}>{link}</Link>
//                   ) : (
//                     <a href="#">{link}</a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         <div className={styles.footerColumn}>
//           <h3 className={styles.footerHeading}>Connect With Us</h3>
//           <div className={styles.footerSocialIcons}>
//             {socialLinks.map((social, index) => {
//               const Icon = social.icon;
//               return (
//                 <a
//                   key={index}
//                   href={social.href}
//                   className={styles.socialIcon}
//                   title={social.name}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Icon />
//                 </a>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className={styles.footerBottom}>
//         <p className={styles.footerCopyright}>
//           2025 Bhava: The Spiritual Company. All rights reserved. Honoring tradition, serving devotion.
//         </p>
//       </div>

//     </footer>
//   );
// }

// export default Footer;



import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const PinterestIcon = () => (
  <i className="fa-brands fa-pinterest" aria-hidden="true" />
);

function Footer() {


  const footerColumns = [
    {
      heading: "Bhava: Store",
      links: ["Shop All Products", "Collections", "Gift Sets", "Memberships"],
    },
    {
      heading: "Sacred Resources",
      links: ["Vedic Blog", "Rituals Guide", "Temple Partners", "Community"],
    },
    {
      heading: "About Bhava:",
      links: ["Our Mission", "Sustainability", "Partnerships", "Careers", "Contact Us", "FAQ"],
    },
  ];

  const socialLinks = [
    {
      name: "Spotify",
      icon: () => <i className="fa-brands fa-spotify" aria-hidden="true" />,
      href: "https://open.spotify.com/user/3123m7vtxk6b6qpa35peedurvd2e",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: "https://www.instagram.com/bhavaglobal/",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: "https://www.facebook.com/bhavaglobal/",
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      href: "https://www.linkedin.com/company/the-spiritual-company/",
    },
    {
      name: "YouTube",
      icon: YouTubeIcon,
      href: "https://www.youtube.com/channel/UCZP_MBw85WMAoZ0zq_kI08Q",
    },
    {
      name: "Pinterest",
      icon: PinterestIcon,
      href: "https://in.pinterest.com/bhavaglobal/",
    },
  ];

  const navigate = useNavigate()

  function scrollElementFully(el) {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const elHeight = rect.height
    const winH = window.innerHeight
    const absoluteTop = window.scrollY + rect.top
    let target
    if (elHeight < winH) {
      // center the element vertically in the viewport when possible
      target = Math.max(absoluteTop - Math.floor((winH - elHeight) / 2), 0)
    } else {
      // element taller than viewport — align to top
      target = absoluteTop
    }
    window.scrollTo({ top: target, behavior: 'smooth' })
    el.focus && el.focus()
  }

  function handleFooterMissionClick(e) {
    e.preventDefault()
    const el = document.getElementById('sacred-mission-title')
    if (el) {
      scrollElementFully(el)
      return
    }
    // If not on the page, navigate to home and ask it to scroll after mount
    navigate('/', { state: { scrollToId: 'sacred-mission-title' } })
  }

  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerContainer}>
        {footerColumns.map((column, index) => (
          <div key={index} className={styles.footerColumn}>
            <h3 className={styles.footerHeading}>{column.heading}</h3>
            <ul className={styles.footerLinks}>
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  {link === "Contact Us" ? (
                    <Link to="/contact" className={styles.contactLink}>{link}</Link>
                  ) : link === "FAQ" ? (
                    <Link to="/faq" className={styles.contactLink}>{link}</Link>
                  ) : link === "Careers" ? (
                    <Link to="/career" className={styles.contactLink}>{link}</Link>
                  ) : link === "Our Mission" ? (
                    <button
                      type="button"
                      className={styles.contactLink}
                      onClick={handleFooterMissionClick}
                      aria-label="View Sacred Mission"
                    >
                      {link}
                    </button>
                  ) : link === "Shop All Products" ? (
                    <button
                      type="button"
                      className={styles.contactLink}
                      onClick={(e) => {
                        e.preventDefault()
                        navigate('/products', { state: { scrollToId: 'products-hero' } })
                      }}
                    >
                      {link}
                    </button>
                  ) : (
                    <a href="#">{link}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Connect With Us</h3>
          <div className={styles.footerSocialIcons}>
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className={styles.socialIcon}
                  title={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <p className={styles.footerAddress}>
            Address : #258, Pocket-5, Sector-2, Rohini, New Delhi - 110085
          </p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerCopyright}>
          2025 Bhava: The Spiritual Company. All rights reserved. Honoring tradition, serving devotion.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
