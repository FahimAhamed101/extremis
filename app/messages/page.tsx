/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";

type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

type MenuItem = {
  title: string;
  href: string;
  iconClass: string;
  active?: boolean;
  children?: Array<{ label: string; href: string }>;
};

type Shortcut = {
  href: string;
  label: string;
  iconClass: string;
  active?: boolean;
};

type ChatContact = {
  name: string;
  image: string;
  status: "online" | "away" | "offline";
  active?: boolean;
};

type ChatMessage = {
  sender: "me" | "you";
  image: string;
  text: string;
};

const sidebarMenu: MenuItem[] = [
  {
    title: "Home",
    href: "#",
    iconClass: "icofont-home",
    active: true,
    children: [
      { label: "Newsfeed", href: "/" },
      { label: "Company Home", href: "company-home.html" },
      { label: "User Profile", href: "/profile" },
      { label: "Student User Profile", href: "/profile" },
      { label: "Groups", href: "groups.html" },
      { label: "Group Detail", href: "group-detail.html" },
      { label: "Social Post Detail", href: "post-detail.html" },
      { label: "Chat/Messages", href: "/messages" },
      { label: "Notifications", href: "notifications.html" },
      { label: "Search Result", href: "search-result.html" },
    ],
  },
  {
    title: "Features",
    href: "#",
    iconClass: "icofont-flash",
    children: [
      { label: "Videos", href: "videos.html" },
      { label: "Live Stream", href: "live-stream.html" },
      { label: "Events Page", href: "event-page.html" },
      { label: "Event Detail", href: "event-detail.html" },
      { label: "QA", href: "Q-A.html" },
      { label: "QA Detail", href: "Q-detail.html" },
      { label: "Support Help", href: "help-faq.html" },
      { label: "Support Detail", href: "help-faq-detail.html" },
    ],
  },
  {
    title: "Market Place",
    href: "#",
    iconClass: "icofont-shopping-bag",
    children: [
      { label: "Books", href: "books.html" },
      { label: "Books Detail", href: "book-detail.html" },
      { label: "Course", href: "courses.html" },
      { label: "Course Detail", href: "course-detail.html" },
      { label: "Add New Course", href: "add-new-course.html" },
      { label: "Cart Page", href: "product-cart.html" },
      { label: "Checkout", href: "product-checkout.html" },
      { label: "Add Credit", href: "add-credits.html" },
      { label: "Payouts", href: "pay-out.html" },
      { label: "Pricing Plans", href: "price-plan.html" },
      { label: "Invoice", href: "invoice.html" },
      { label: "Thank You Page", href: "thank-you.html" },
    ],
  },
  {
    title: "Blogs",
    href: "#",
    iconClass: "icofont-coffee-cup",
    children: [
      { label: "Blog", href: "blog.html" },
      { label: "Blog Detail", href: "blog-detail.html" },
    ],
  },
  {
    title: "Featured Pages",
    href: "#",
    iconClass: "icofont-file-text",
    children: [
      { label: "Error 404", href: "404.html" },
      { label: "Coming Soon", href: "coming-soon.html" },
      { label: "Send Feedback", href: "send-feedback.html" },
      { label: "Badges", href: "badges.html" },
      { label: "Thank You", href: "thank-you.html" },
    ],
  },
  {
    title: "Authentications",
    href: "#",
    iconClass: "icofont-lock",
    children: [
      { label: "Sign In", href: "/login" },
      { label: "Sign Up", href: "/signup" },
      { label: "Forgot Password", href: "forgot-password.html" },
    ],
  },
  {
    title: "University Profile",
    href: "about-university.html",
    iconClass: "icofont-users-social",
  },
  {
    title: "Live Chat",
    href: "/messages",
    iconClass: "icofont-ui-messaging",
  },
  {
    title: "Privacy Policies",
    href: "privacy-n-policy.html",
    iconClass: "icofont-shield-alt",
  },
  {
    title: "Web Settings",
    href: "settings.html",
    iconClass: "icofont-settings",
  },
  {
    title: "Development Tools",
    href: "#",
    iconClass: "icofont-tools-alt-2",
    children: [
      { label: "Widgets Collection", href: "widgets.html" },
      { label: "Web Component", href: "development-component.html" },
      { label: "Web Elements", href: "development-elements.html" },
      { label: "Loader Spinners", href: "loader-spiners.html" },
    ],
  },
];

const shortcuts: Shortcut[] = [
  { href: "/", label: "Newsfeed", iconClass: "icofont-flash", active: true },
  { href: "videos.html", label: "Videos", iconClass: "icofont-ui-video-play" },
  { href: "courses.html", label: "Courses", iconClass: "icofont-airplane-alt" },
  { href: "books.html", label: "Books", iconClass: "icofont-book-alt" },
  { href: "blog.html", label: "Blog", iconClass: "icofont-layout" },
  { href: "groups.html", label: "Groups", iconClass: "icofont-users-social" },
];

const chatContacts: ChatContact[] = [
  { name: "Oliver", image: "/images/resources/friend-avatar.jpg", status: "away", active: true },
  { name: "Sarah", image: "/images/resources/friend-avatar2.jpg", status: "online" },
  { name: "Andrew", image: "/images/resources/friend-avatar3.jpg", status: "offline" },
  { name: "Mikaly", image: "/images/resources/friend-avatar4.jpg", status: "online" },
  { name: "Bumsy", image: "/images/resources/friend-avatar5.jpg", status: "away" },
  { name: "Harry", image: "/images/resources/friend-avatar.jpg", status: "offline" },
  { name: "Laila", image: "/images/resources/friend-avatar2.jpg", status: "offline" },
  { name: "Noah", image: "/images/resources/friend-avatar3.jpg", status: "offline" },
  { name: "Maria", image: "/images/resources/friend-avatar4.jpg", status: "offline" },
  { name: "Ellie", image: "/images/resources/friend-avatar5.jpg", status: "offline" },
];

const chatMessages: ChatMessage[] = [
  { sender: "you", image: "/images/resources/userlist-2.jpg", text: "what's liz short for? :)" },
  { sender: "me", image: "/images/resources/userlist-1.jpg", text: "Elizabeth lol" },
  { sender: "me", image: "/images/resources/userlist-1.jpg", text: "wanna know whats my second guess was?" },
  { sender: "you", image: "/images/resources/userlist-2.jpg", text: "yes" },
  { sender: "me", image: "/images/resources/userlist-1.jpg", text: "Disney's the lizard king" },
  { sender: "me", image: "/images/resources/userlist-1.jpg", text: "i know him 5 years ago" },
  { sender: "you", image: "/images/resources/userlist-2.jpg", text: "coooooooooool dude ;)" },
];

const profileDetails = [
  { label: "Display Name", value: "Harry" },
  { label: "Local time", value: "3:40AM" },
  { label: "Email Address", value: "Sample@gmail.com" },
  { label: "Phone Number", value: "+1 223 509309" },
  { label: "Skype Id", value: "Sarah22" },
];

function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export default function MessagesPage() {
  return (
    <RequireAuth>
      <>
        <div className="theme-layout">
          <HomeHeader />

          <nav className="sidebar">
            <ul className="menu-slide">
              {sidebarMenu.map((item) => (
                <li
                  key={item.title}
                  className={`${item.children ? "menu-item-has-children" : ""} ${item.active ? "active" : ""}`.trim()}
                >
                  <SmartLink href={item.href} title={item.title}>
                    <i className={item.iconClass}></i> {item.title}
                  </SmartLink>
                  {item.children ? (
                    <ul className="submenu">
                      {item.children.map((child) => (
                        <li key={`${item.title}-${child.label}`}>
                          <SmartLink href={child.href} title={child.label}>
                            {child.label}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>



          <section>
            <div className="gap">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div id="page-contents" className="row merged20">
                      <div className="col-lg-8">
                        <div className="main-wraper">
                          <h3 className="main-title">Messages</h3>
                          <div className="message-box">
                            <div className="message-header">
                              {chatContacts.map((contact) => (
                                <div
                                  className={`useravatar ${contact.active ? "active" : ""}`.trim()}
                                  key={`${contact.name}-${contact.status}`}
                                >
                                  <img src={contact.image} alt={contact.name} />
                                  <span>{contact.name}</span>
                                  <div className={`status ${contact.status}`}></div>
                                </div>
                              ))}
                            </div>

                            <div className="message-content">
                              <div className="chat-header">
                                <div className="status online"></div>
                                <h6>last seen on today at 12:39</h6>
                                <div className="corss">
                                  <span className="report"><i className="icofont-flag"></i></span>
                                  <span className="options"><i className="icofont-brand-flikr"></i></span>
                                </div>
                              </div>

                              <div className="chat-content">
                                <div className="date">Wednesday 25, March</div>
                                <ul className="chatting-area">
                                  {chatMessages.map((message, index) => (
                                    <li className={message.sender} key={`${message.sender}-${index}`}>
                                      <figure><img src={message.image} alt={message.sender} /></figure>
                                      <p>{message.text}</p>
                                    </li>
                                  ))}
                                </ul>

                                <div className="message-text-container">
                                  <div className="more-attachments">
                                    <i className="icofont-plus"></i>
                                  </div>
                                  <div className="attach-options">
                                    <a href="#" title=""><i className="icofont-camera"></i> Open Camera</a>
                                    <a href="#" title=""><i className="icofont-video-cam"></i> Photo &amp; video Library</a>
                                    <a href="#" title=""><i className="icofont-paper-clip"></i> Attach Document</a>
                                    <a href="#" title=""><i className="icofont-location-pin"></i> Share Location</a>
                                    <a href="#" title=""><i className="icofont-contact-add"></i> Share Contact</a>
                                  </div>
                                  <form method="post">
                                    <span className="emojie"><img src="/images/smiles/happy.png" alt="emoji" /></span>
                                    <textarea rows={1} placeholder="say someting..."></textarea>
                                    <button type="submit" title="send"><i className="icofont-paper-plane"></i></button>
                                    <div className="smiles-bunch">
                                      <i><img src="/images/smiles/angry-1.png" alt="" /></i>
                                      <i><img src="/images/smiles/angry.png" alt="" /></i>
                                      <i><img src="/images/smiles/bored-1.png" alt="" /></i>
                                      <i><img src="/images/smiles/bored-2.png" alt="" /></i>
                                      <i><img src="/images/smiles/bored.png" alt="" /></i>
                                      <i><img src="/images/smiles/confused-1.png" alt="" /></i>
                                      <i><img src="/images/smiles/confused.png" alt="" /></i>
                                      <i><img src="/images/smiles/crying-1.png" alt="" /></i>
                                      <i><img src="/images/smiles/crying.png" alt="" /></i>
                                      <i><img src="/images/smiles/tongue-out.png" alt="" /></i>
                                      <i><img src="/images/smiles/wink.png" alt="" /></i>
                                      <i><img src="/images/smiles/suspicious.png" alt="" /></i>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="profile-short">
                          <div className="chating-head">
                            <div className="s-left">
                              <h5>Sarah Martin</h5>
                              <p>United States</p>
                            </div>
                            <div className="s-right">
                              <span title="Call Video"><i className="icofont-video-cam"></i></span>
                              <span title="Call Audio"><i className="icofont-ui-call"></i></span>
                            </div>
                          </div>

                          <div className="short-intro">
                            <figure><img src="/images/resources/album1.jpg" alt="Sarah Martin" /></figure>
                            <ul>
                              {profileDetails.map((detail) => (
                                <li key={detail.label}>
                                  <span>{detail.label}</span>
                                  <p>{detail.value}</p>
                                </li>
                              ))}
                            </ul>
                            <Link className="button primary circle" href="/profile" title="View Profile">
                              view Profile
                            </Link>
                            <a className="button primary circle danger" href="#" title="Block Chat">
                              Block Chat
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <figure className="bottom-mockup">
            <img src="/images/footer.png" alt="" />
          </figure>

          <div className="bottombar">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <span>&copy; copyright All rights reserved by Extremis 2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </RequireAuth>
  );
}
