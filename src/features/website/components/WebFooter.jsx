import { Link } from "react-router-dom";
import { Col, Container, Row } from "@/components/ui";
import StoreLinks from "./StoreLinks";

const LEGAL_LINK =
  "text-[18px] font-medium text-white transition-all duration-300 hover:text-[#3f68b3] max-lg:text-[17px] max-md:text-base max-sm:text-[15px] max-[350px]:text-sm";

export default function WebFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0c101b] pt-12.5 max-lg:pt-11.25 max-md:pt-10 max-md:text-center max-sm:pt-8.75 max-[400px]:pt-7.5">
      <Container>
        <Row gutter={3} gutterSm={4} className="items-center">
          <Col md={6}>
            <h3 className="mb-2.5 text-[30px] leading-[1.2] font-bold text-white max-lg:text-[28px] max-md:text-[26px] max-sm:text-2xl max-[400px]:text-[22px] max-[350px]:text-xl">
              AI Math Scanner
            </h3>
            <p className="mb-4 text-base font-medium text-white max-sm:text-[15px] max-[350px]:text-sm">
              Download AI Math Scanner to instantly solve any math problem with AI-powered accuracy. Scan or type
              equations and get step-by-step solutions in seconds!
            </p>
          </Col>
          <Col md={6}>
            <div className="flex items-center justify-end max-md:justify-center max-md:[&_img]:h-13.75 max-[400px]:[&_img]:h-12.5">
              <StoreLinks
                playSrc="/footer/playstore.svg"
                playAlt="PlayStore"
                appSrc="/footer/appstore.svg"
                appAlt="AppStore"
              />
            </div>
          </Col>
          <Col xs={12}>
            <div className="my-5 flex items-center justify-between border-t border-[#404a63] pt-5 max-lg:mt-4 max-lg:flex-wrap max-lg:justify-center max-md:mt-3 max-sm:my-4 max-sm:pt-4 max-[350px]:my-3 max-[350px]:pt-3">
              <ul className="m-0 flex list-none items-center p-0 max-lg:mb-3">
                <li className="mr-4 border-r border-[#404a63] pr-4">
                  <Link to="/privacy-policy" target="_blank" className={LEGAL_LINK}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-use" target="_blank" className={LEGAL_LINK}>
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
              <p className="m-0 text-center text-[18px] font-medium text-white max-lg:text-[17px] max-md:text-base max-sm:text-[15px] max-[350px]:text-sm">
                All rights reserved © {currentYear} AI Math Scanner
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
