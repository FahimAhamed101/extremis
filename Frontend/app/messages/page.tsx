/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import MessagesPageClient from "@/components/messages/MessagesPageClient";

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
      { label: "Videos", href: "/videos" },
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
      { label: "Blog", href: "/blog" },
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
                      <MessagesPageClient />
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
