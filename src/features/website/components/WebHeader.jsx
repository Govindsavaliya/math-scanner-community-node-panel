import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Icon } from "@/components/ui";
import { paths } from "@/app/router/paths";
import { cn } from "@/utils/cn";
import { NAV_SECTIONS } from "../data";
import StoreLinks from "./StoreLinks";

// Underline (::before) grows in under the active link; on mobile the menu is a white card, so links go dark.
const NAV_LINK =
  "relative mx-4 inline-block p-0 text-base font-medium transition-colors duration-200 ease-linear before:absolute before:inset-x-0 before:-bottom-1.5 before:h-0.5 before:w-full before:origin-center before:bg-white before:transition-[opacity,transform] before:duration-200 before:ease-in-out before:content-[''] max-lg:m-0 max-lg:block max-lg:w-full max-lg:py-2 max-lg:text-left";
const NAV_LINK_ACTIVE = "text-white before:scale-x-100 before:opacity-100 max-lg:text-[#1b4188]";
const NAV_LINK_IDLE = "text-white before:scale-x-0 before:opacity-0 max-lg:text-[#24272c]";

export default function WebHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navbarCollapseRef = useRef(null);
  const headerRef = useRef(null);
  const location = useLocation();
  const isContactPage = location.pathname === paths.websiteContact;

  const [activeSection, setActiveSection] = useState("home");
  const activeSectionRef = useRef("home");
  const intersectionDataRef = useRef({});
  const debounceTimerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY >= 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is closest to the viewport centre (drives the active nav link).
  useEffect(() => {
    const elements = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter((el) => el);

    if (!elements.length) {
      return;
    }

    const intersectionData = intersectionDataRef.current;

    const scheduleUpdateActiveSection = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        const entries = Object.entries(intersectionData);
        if (!entries.length) {
          return;
        }

        let bestId = entries[0][0];
        let bestScore = entries[0][1];

        for (let i = 1; i < entries.length; i += 1) {
          const [id, score] = entries[i];
          if (score > bestScore) {
            bestId = id;
            bestScore = score;
          }
        }

        if (bestId && bestId !== activeSectionRef.current) {
          activeSectionRef.current = bestId;
          setActiveSection(bestId);
        }
      }, 60);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const viewportCenter = viewportHeight / 2;

        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) {
            return;
          }

          const rect = entry.boundingClientRect;

          if (!entry.isIntersecting || rect.bottom <= 0 || rect.top >= viewportHeight) {
            delete intersectionData[id];
            return;
          }

          const sectionCenter = rect.top + rect.height / 2;
          const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
          const score = 1 / (1 + distanceFromCenter);

          intersectionData[id] = score;
        });

        scheduleUpdateActiveSection();
      },
      {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const navbarCollapse = navbarCollapseRef.current;
    if (!navbarCollapse) return;

    if (isNavOpen) {
      navbarCollapse.style.display = "block";
      navbarCollapse.style.height = "0";
      navbarCollapse.style.overflow = "hidden";
      navbarCollapse.style.transition = "height 0.35s ease";

      void navbarCollapse.offsetHeight;

      const scrollHeight = navbarCollapse.scrollHeight;
      navbarCollapse.style.height = `${scrollHeight}px`;

      const onTransitionEnd = () => {
        navbarCollapse.style.height = "";
        navbarCollapse.style.overflow = "";
        navbarCollapse.style.transition = "height 0.35s ease";
      };

      navbarCollapse.addEventListener("transitionend", onTransitionEnd);

      return () => {
        navbarCollapse.removeEventListener("transitionend", onTransitionEnd);
      };
    }

    navbarCollapse.style.display = "block";
    navbarCollapse.style.height = `${navbarCollapse.scrollHeight}px`;
    navbarCollapse.style.overflow = "hidden";
    navbarCollapse.style.transition = "height 0.35s ease";

    void navbarCollapse.offsetHeight;

    navbarCollapse.style.transition = "height 0.35s ease";
    navbarCollapse.style.height = "0";

    const onTransitionEnd = () => {
      navbarCollapse.style.display = "none";
      navbarCollapse.style.height = "";
      navbarCollapse.style.overflow = "";
      navbarCollapse.style.transition = "";
    };

    navbarCollapse.addEventListener("transitionend", onTransitionEnd);

    return () => {
      navbarCollapse.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [isNavOpen]);

  const scrollToCenter = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerElement = headerRef.current;
    const headerHeight = headerElement ? headerElement.offsetHeight : 0;

    const elementTop = el.getBoundingClientRect().top + window.pageYOffset;

    const offset = 16;
    const targetPosition = Math.max(0, elementTop - headerHeight - offset);

    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  };

  const handleHashLinkClick = (e, sectionId) => {
    e.preventDefault();

    if (location.pathname === paths.website) {
      scrollToCenter(sectionId);
      setActiveSection(sectionId);
    } else {
      navigate(paths.website);
      setActiveSection(sectionId);
      setTimeout(() => scrollToCenter(sectionId), 150);
    }

    setIsNavOpen(false);
  };

  const handleContactPageNavigation = (e, sectionId) => {
    e.preventDefault();
    navigate(paths.website);

    setTimeout(() => {
      scrollToCenter(sectionId);
    }, 150);

    setActiveSection(sectionId);
    setIsNavOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNavOpen &&
        navbarCollapseRef.current &&
        !navbarCollapseRef.current.contains(event.target) &&
        event.target.closest(!"[data-nav-toggle]")
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isNavOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 z-1000 w-full transition-all duration-300 ease-out",
        isScrolled ? "py-0" : "py-2.5",
      )}
    >
      <Container>
        <nav
          className={cn(
            "relative flex flex-wrap items-center justify-between rounded-[0.625rem] bg-[#1b4188] transition-all duration-300 ease-out lg:flex-nowrap lg:justify-start",
            isScrolled ? "px-4 py-2" : "p-4 max-lg:p-3",
          )}
        >
          <Link className="mr-4 flex items-center p-0 whitespace-nowrap" to={paths.website}>
            <img
              src="/logo/logo.png"
              alt="AI Math Scanner"
              className="h-15 rounded-[0.625rem] transition-all duration-300 ease-out max-lg:h-12.5 max-sm:h-11.25"
            />
            <span className="ml-4 hidden text-[22px] leading-normal font-bold text-white max-lg:inline-block max-lg:text-xl max-md:text-[19px] max-sm:text-lg max-[400px]:ml-3 max-[400px]:text-[17px] min-[1400px]:inline-block">
              AI Math Scanner
            </span>
          </Link>

          <button
            className="cursor-pointer border-0 bg-transparent px-3 py-1 text-xl leading-none focus:shadow-none focus:outline-none lg:hidden"
            type="button"
            data-nav-toggle
            onClick={() => setIsNavOpen(!isNavOpen)}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="flex size-[1.5em] items-center justify-center rounded-[0.325rem] border border-white">
              <Icon name="menu" className="text-xl text-white" />
            </span>
          </button>

          <div
            ref={navbarCollapseRef}
            className="grow basis-full items-center max-lg:mt-2.5 lg:flex lg:basis-auto"
            style={{ display: isNavOpen ? "block" : "none" }}
          >
            {/* Section links scroll in place on the home page; from the contact page they navigate home first. */}
            <ul className="m-auto flex max-h-[75vh] list-none flex-col items-center overflow-y-auto p-0 max-lg:rounded-2xl max-lg:bg-white max-lg:p-4 lg:flex-row lg:overflow-visible">
              {NAV_SECTIONS.map(({ id, label }) => (
                <li className="max-lg:block max-lg:w-full" key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(NAV_LINK, !isContactPage && activeSection === id ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
                    onClick={(e) =>
                      isContactPage ? handleContactPageNavigation(e, id) : handleHashLinkClick(e, id)
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="max-lg:block max-lg:w-full">
                <Link
                  to={paths.websiteContact}
                  className={cn(NAV_LINK, isContactPage ? NAV_LINK_ACTIVE : NAV_LINK_IDLE)}
                  onClick={() => setIsNavOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center max-lg:hidden [&_a]:block">
            <StoreLinks
              playSrc="/logo/playstore.svg"
              playAlt="Play Store"
              appSrc="/logo/appstore.svg"
              appAlt="App Store"
            />
          </div>
        </nav>
      </Container>
    </header>
  );
}
