import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Col, Container, Row } from "@/components/ui";
import { cn } from "@/utils/cn";
import { stepSlides } from "../data";
import Section from "./Section";
import SectionTitle, { Accent } from "./SectionTitle";

// Numbered circle (::before) for each list item.
const STEP_BASE =
  "relative mb-5 pl-16 before:absolute before:top-0 before:left-0 before:flex before:size-11.25 before:items-center before:justify-center before:rounded-[50px] before:border before:text-[18px] before:font-semibold before:transition-all before:duration-300 before:content-[attr(data-slide)] max-md:mb-4 max-md:pl-14 max-sm:mb-3 max-sm:pl-13 max-sm:before:size-10 max-sm:before:text-[15px] max-[400px]:pl-12 max-[400px]:before:size-8.75 max-[400px]:before:text-sm";
const STEP_ACTIVE = "before:border-[#3f68b3] before:bg-[#3f68b3] before:text-white";
const STEP_IDLE = "before:border-[rgba(108,115,125,0.3)] before:bg-white before:text-[#6c737d]";
// Dashed connector (::after) down to the next step; the last item has none.
const STEP_LINE =
  "after:absolute after:top-11.25 after:left-5.625 after:h-full after:border after:border-dashed after:border-[rgba(108,115,125,0.3)] after:content-[''] max-sm:after:top-10 max-sm:after:left-5 max-[400px]:after:top-8.75 max-[400px]:after:left-4.25";

const STEP_TITLE =
  "mb-3 cursor-pointer pt-2.6 text-[22px] leading-[1.2] font-bold transition-all duration-300 max-xl:text-xl max-lg:text-[19px] max-md:mb-2 max-md:text-lg max-sm:mb-1.4 max-sm:pt-1.8 max-[400px]:mb-1 max-[400px]:pt-1.4 max-[400px]:text-[17px] max-[350px]:text-base";

export default function HowItWorksSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const stepsSwiperRef = useRef(null);

  // Clicking a list item jumps the mockup slider to that step.
  const handleWorkListClick = (index) => {
    setActiveSlide(index);
    stepsSwiperRef.current?.swiper?.slideTo(index);
  };

  return (
    <Section id="howitworks" className="bg-[linear-gradient(180deg,#f3f6ff_0%,#fff_100%)]">
      <Container>
        <SectionTitle
          heading={
            <>
              How to use <Accent>AI Math Scanner</Accent>
            </>
          }
        >
          Here's a quick and simple step-by-step guide on how to use the app
        </SectionTitle>
        <Row className="justify-center">
          <Col xl={11}>
            <Row gutter={3} gutterSm={4} className="items-center">
              <Col lg={7}>
                <ul className="m-0 list-none p-0">
                  {stepSlides.map((step, index) => (
                    <li
                      key={step.id}
                      data-slide={`0${index + 1}`}
                      className={cn(
                        STEP_BASE,
                        activeSlide === index ? STEP_ACTIVE : STEP_IDLE,
                        index < stepSlides.length - 1 && STEP_LINE,
                      )}
                      onClick={() => handleWorkListClick(step.id - 1)}
                    >
                      <h4 className={cn(STEP_TITLE, activeSlide === index ? "text-[#3f68b3]" : "text-[#24272c]")}>
                        {step.title}
                      </h4>
                      <p className="m-0 text-[15px] text-[#6c737d] max-[400px]:text-sm">{step.description}</p>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col lg={5}>
                <div className="relative z-1 text-center">
                  <div className="relative text-center">
                    <div className="pointer-events-none absolute inset-0 z-3 bg-[url(/screen/mockup.png)] bg-contain bg-center bg-no-repeat" />
                    <Swiper
                      ref={stepsSwiperRef}
                      modules={[Autoplay, EffectFade]}
                      slidesPerView={1}
                      effect="fade"
                      fadeEffect={{ crossFade: true }}
                      loop={true}
                      autoplay={{ delay: 2000, disableOnInteraction: false }}
                      speed={700}
                      onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                      className="text-center"
                    >
                      {stepSlides.map((step) => (
                        <SwiperSlide key={step.id}>
                          <div className="relative">
                            <img src={step.img} className="relative -z-10 mx-auto p-3" alt={step.title} />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}
