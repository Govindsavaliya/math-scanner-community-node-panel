import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Col, Container, Row } from "@/components/ui";
import { screenSlides } from "../data";
import Section from "./Section";
import SectionTitle, { Accent } from "./SectionTitle";

const BREAKPOINTS = {
  576: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  992: { slidesPerView: 4 },
};

// Phone frame (::before) centred over the slider; it keeps the 768-1399px size down to the 767px step.
const SLIDER =
  "py-5 max-2xl:py-3.5 max-xl:py-5 max-lg:py-3.5 max-md:py-2.5 before:absolute before:top-1/2 before:left-1/2 before:z-3 before:mx-auto before:h-146.5 before:w-72 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[url(/screen/mockup.png)] before:bg-cover before:bg-no-repeat before:content-[''] max-2xl:before:h-126 max-2xl:before:w-61.75 max-md:before:h-141.25 max-md:before:w-69.5 max-[320px]:before:hidden";

// The active slide is full size; its neighbours and the rest are scaled down and faded.
const SLIDE =
  "scale-70 text-center opacity-60 transition-all duration-300 [&.swiper-slide-active]:scale-100 [&.swiper-slide-active]:opacity-100 max-2xl:[&.swiper-slide-active]:scale-[0.86] max-xl:[&.swiper-slide-active]:scale-[0.96] [&.swiper-slide-next]:scale-80 [&.swiper-slide-next]:opacity-80 [&.swiper-slide-prev]:scale-80 [&.swiper-slide-prev]:opacity-80";

export default function ScreensSection() {
  return (
    <Section id="screens" className="overflow-hidden bg-white">
      <Container>
        <SectionTitle
          heading={
            <>
              Explore our<Accent> Amazing Interface</Accent>
            </>
          }
        >
          Enjoy an easy-to-use interface in AI Math Scanner for smooth learning and fast solutions.
        </SectionTitle>
        <Row gutter={3} gutterSm={4}>
          <Col xs={12}>
            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              centeredSlides={true}
              loop={true}
              watchSlidesProgress={true}
              breakpoints={BREAKPOINTS}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              className={SLIDER}
            >
              {screenSlides.map((slide) => (
                <SwiperSlide key={slide.id} className={SLIDE} style={{ width: "288px" }}>
                  <img src={slide.img} className="mx-auto" alt={slide.alt} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}
