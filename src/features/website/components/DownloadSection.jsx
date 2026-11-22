import { Col, Container, Row } from "@/components/ui";
import Section from "./Section";
import StoreLinks from "./StoreLinks";

/** Floating decorative shapes, positioned per numbered svg file. */
const SHAPES = {
  1: "top-10 left-45 max-xl:left-40 max-lg:left-27.5",
  2: "top-42.5 left-17.5 max-lg:top-47.5 max-lg:left-2.5",
  3: "bottom-7.5 left-56.25 max-xl:left-45 max-lg:bottom-3.75 max-lg:left-28.75",
  4: "top-12.5 right-45 max-xl:top-10 max-xl:right-37.5 max-lg:right-27.5",
  5: "top-42.5 right-17.5 max-lg:top-47.5 max-lg:right-2.5",
  6: "right-48.75 bottom-10 max-lg:right-28.75 max-lg:bottom-3.75",
};

const BOX =
  "relative rounded-2xl bg-[url(/download/bg.svg)] bg-cover bg-center bg-no-repeat px-17.5 py-22.5 max-xl:px-15 max-xl:py-20 max-lg:px-12.5 max-lg:py-17.5 max-md:px-8.75 max-sm:p-5 max-[400px]:p-4";

export default function DownloadSection() {
  return (
    <Section id="download" className="bg-white">
      <Container>
        <div className={BOX}>
          <div className="max-md:hidden">
            {Object.entries(SHAPES).map(([id, position]) => (
              <img key={id} src={`/download/${id}.svg`} alt="Decorative shape" className={`absolute max-lg:w-15 ${position}`} />
            ))}
          </div>
          <Row gutter={3} gutterSm={4} className="items-center justify-center">
            <Col lg={8}>
              <div className="text-center">
                <h2 className="mb-4 text-[32px] leading-[1.2] font-extrabold text-[#24272c] max-md:mb-2 max-md:text-[30px] max-sm:text-[28px] max-[400px]:text-[26px] max-[350px]:text-2xl">
                  Get Started Today
                </h2>
                <p className="mb-7 text-[15px] font-normal text-[#6c737d] max-md:mb-6 max-sm:mb-5 max-[400px]:mb-4 max-[400px]:text-sm">
                  Don't wait to transform your math learning journey. Download AI Math Scanner: Math Solver now and
                  start solving problems instantly. With its powerful features and easy interface, your perfect math
                  companion is just a click away. Start solving today!
                </p>
                <div className="flex flex-wrap items-center justify-center max-sm:[&_a]:my-2 max-[350px]:[&_a]:my-1">
                  <StoreLinks
                    playSrc="/download/playstore.png"
                    playAlt="Download on Google Play"
                    appSrc="/download/appstore.png"
                    appAlt="Download on App Store"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </Section>
  );
}
