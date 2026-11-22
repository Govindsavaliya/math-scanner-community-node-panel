import { Col, Container, Row } from "@/components/ui";
import StoreLinks from "./StoreLinks";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full scroll-mt-20 pt-31.25 pb-12.5 before:absolute before:inset-x-0 before:top-0 before:bottom-0 before:h-full before:w-full before:bg-[url(/hero/bg.jpg)] before:bg-cover before:bg-center before:bg-no-repeat before:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-28.5 after:w-full after:bg-[url(/hero/shape.svg)] after:bg-cover after:bg-center after:bg-no-repeat after:content-[''] max-xl:pt-30 max-lg:pb-11.25 max-md:pb-10 max-sm:pt-25 max-sm:pb-4"
    >
      <Container>
        <Row gutter={0} className="items-center justify-center">
          <Col lg={6}>
            <div className="relative z-2 max-lg:text-center">
              <h1 className="m-0 text-[50px] leading-[1.2] font-bold text-[#24272c] max-2xl:text-[45px] max-lg:text-[40px] max-md:text-[36px] max-sm:text-[32px] max-[400px]:text-[30px] max-[350px]:text-[28px]">
                <span className="block text-[#3f68b3] max-sm:inline">AI Math Scanner</span> Instant Accurate Solutions
              </h1>
              <p className="mt-4 mb-8 text-[18px] leading-normal text-[#6c737d] max-lg:text-[17px] max-md:mb-6 max-md:text-base max-[400px]:mb-4 max-[400px]:text-[15px] max-[350px]:text-sm">
                Solve math equations instantly with AI. Scan or type your equation to get step-by-step solutions, from
                algebra to calculus.
              </p>
              <div className="flex flex-wrap items-center max-lg:justify-center max-sm:[&_img]:h-13.75 max-[400px]:[&_a]:my-1 max-[400px]:[&_img]:h-12.5">
                <StoreLinks
                  playSrc="/footer/playstore.svg"
                  playAlt="Google Play Store"
                  appSrc="/footer/appstore.svg"
                  appAlt="Apple App Store"
                />
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="relative z-2 flex justify-between">
              <img
                src="/hero/hero.png"
                alt="AI Math Scanner App"
                className="max-lg:mx-auto max-lg:mt-5 max-lg:max-w-4/5"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
