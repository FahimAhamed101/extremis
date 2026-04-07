/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
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

type BlogPost = {
  image: string;
  reads: string;
  comments: string;
  title: string;
  excerpt: string;
  date: string;
};

type PopularBook = {
  image: string;
  title: string;
  author: string;
};

type Follower = {
  image: string;
  name: string;
  subtitle: string;
};

export const metadata: Metadata = {
  title: "Extremis | Blog",
  description: "Read the latest posts, insights and updates on Extremis.",
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

const blogPosts: BlogPost[] = [
  {
    image: "/images/resources/blog-list-1.jpg",
    reads: "93k",
    comments: "33",
    title: "Love is always the happiness of a heart.",
    excerpt:
      "Our online class is an affordable alternative to private therapy and coaching, and teaches day Lorem ipsum dolor sit amet.",
    date: "January 23, 2021",
  },
  {
    image: "/images/resources/blog-list-2.jpg",
    reads: "93k",
    comments: "33",
    title: "Love is always the happiness of a heart.",
    excerpt:
      "Our online class is an affordable alternative to private therapy and coaching, and teaches day Lorem ipsum dolor sit amet.",
    date: "January 23, 2021",
  },
  {
    image: "/images/resources/blog-list-3.jpg",
    reads: "93k",
    comments: "33",
    title: "Compare Prices Find The Best Computer Accessory",
    excerpt:
      "Our online class is an affordable alternative to private therapy and coaching, and teaches day Lorem ipsum dolor sit amet.",
    date: "January 23, 2021",
  },
  {
    image: "/images/resources/blog-list-4.jpg",
    reads: "93k",
    comments: "33",
    title: "Will The Democrats Be Able To Reverse The Online Gambling Ban",
    excerpt:
      "Our online class is an affordable alternative to private therapy and coaching, and teaches day Lorem ipsum dolor sit amet.",
    date: "January 23, 2021",
  },
  {
    image: "/images/resources/blog-list-5.jpg",
    reads: "93k",
    comments: "33",
    title: "Love is always the happiness of a heart.",
    excerpt:
      "Our online class is an affordable alternative to private therapy and coaching, and teaches day Lorem ipsum dolor sit amet.",
    date: "January 23, 2021",
  },
];

const popularBooks: PopularBook[] = [
  { image: "/images/resources/book10.jpg", title: "Vu.js 2 Basics", author: "Richard Ali" },
  { image: "/images/resources/book9.jpg", title: "Css3 for Bigners", author: "Richard Ali" },
  { image: "/images/resources/book5.jpg", title: "Technology Wants 2020", author: "Richard Ali" },
];

const followers: Follower[] = [
  { image: "/images/resources/friend-avatar.jpg", name: "Kelly Bill", subtitle: "Dept colleague" },
  { image: "/images/resources/friend-avatar2.jpg", name: "Issabel", subtitle: "Dept colleague" },
  { image: "/images/resources/friend-avatar3.jpg", name: "Andrew", subtitle: "Dept colleague" },
  { image: "/images/resources/friend-avatar4.jpg", name: "Sophia", subtitle: "Dept colleague" },
  { image: "/images/resources/friend-avatar5.jpg", name: "Allen", subtitle: "Dept colleague" },
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

export default function BlogPage() {
  return (
    <RequireAuth>
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
                    <div className="col-lg-9">
                      <div className="main-wraper">
                        <div className="main-title">Blog Posts</div>
                        {blogPosts.map((post) => (
                          <div className="blog-posts" key={`${post.image}-${post.title}`}>
                            <figure>
                              <img src={post.image} alt={post.title} />
                            </figure>
                            <div className="blog-post-meta">
                              <ul>
                                <li>
                                  <i className="icofont-read-book"></i>
                                  <a title="Reads" href="#">
                                    {post.reads}
                                  </a>
                                </li>
                                <li>
                                  <i className="icofont-comment"></i>
                                  <a title="Comments" href="#">
                                    {post.comments}
                                  </a>
                                </li>
                              </ul>

                              <h4>{post.title}</h4>
                              <p>{post.excerpt}</p>
                              <span>
                                <i className="icofont-clock-time"></i> {post.date}
                              </span>
                              <a href="blog-detail.html" title="Read more" className="button primary circle">
                                read more
                              </a>
                            </div>
                          </div>
                        ))}

                        <div className="load mt-5 mb-4">
                          <ul className="pagination">
                            <li>
                              <a href="#" title="Previous">
                                <i className="icofont-arrow-left"></i>
                              </a>
                            </li>
                            <li>
                              <a className="active" href="#" title="Page 1">
                                1
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Page 2">
                                2
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Page 3">
                                3
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Page 4">
                                4
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Page 5">
                                5
                              </a>
                            </li>
                            <li>....</li>
                            <li>
                              <a href="#" title="Page 10">
                                10
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Next">
                                <i className="icofont-arrow-right"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3">
                      <aside className="sidebar static right">
                        <div className="widget">
                          <h4 className="widget-title">Popular Books</h4>
                          {popularBooks.map((book) => (
                            <div className="popular-book" key={`${book.image}-${book.title}`}>
                              <figure>
                                <img src={book.image} alt={book.title} />
                              </figure>
                              <div className="book-about">
                                <h6>
                                  <a href="#" title={book.title}>
                                    {book.title}
                                  </a>
                                </h6>
                                <span>{book.author}</span>
                                <a href="#" title="Bookmark">
                                  <i className="icofont-book-mark"></i>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="widget">
                          <h4 className="widget-title">Ask Research Question?</h4>
                          <div className="ask-question">
                            <i className="icofont-question-circle"></i>
                            <h6>Ask questions in Q&A to get help from experts in your field.</h6>
                            <a className="ask-qst" href="#" title="Ask a question">
                              Ask a question
                            </a>
                          </div>
                        </div>

                        <div className="widget">
                          <h4 className="widget-title">
                            Explor Events{" "}
                            <a className="see-all" href="#" title="See all events">
                              See All
                            </a>
                          </h4>
                          <div className="rec-events bg-purple">
                            <i className="icofont-gift"></i>
                            <h6>
                              <a title="Event" href="#">
                                BZ University good night event in columbia
                              </a>
                            </h6>
                            <img alt="" src="/images/clock.png" />
                          </div>
                          <div className="rec-events bg-blue">
                            <i className="icofont-microphone"></i>
                            <h6>
                              <a title="Event" href="#">
                                The 3rd International Conference 2020
                              </a>
                            </h6>
                            <img alt="" src="/images/clock.png" />
                          </div>
                        </div>

                        <div className="widget stick-widget">
                          <h4 className="widget-title">Who&apos;s follownig</h4>
                          <ul className="followers">
                            {followers.map((follower) => (
                              <li key={`${follower.image}-${follower.name}`}>
                                <figure>
                                  <img alt={follower.name} src={follower.image} />
                                </figure>
                                <div className="friend-meta">
                                  <h4>
                                    <a title={follower.name} href="time-line.html">
                                      {follower.name}
                                    </a>
                                    <span>{follower.subtitle}</span>
                                  </h4>
                                  <a className="underline" title="Follow" href="#">
                                    Follow
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </aside>
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
    </RequireAuth>
  );
}

