import { Col, Container, Row } from "@/components/ui";
import Section from "./Section";
import SectionTitle from "./SectionTitle";

const HEADING =
  "mb-2 text-[32px] leading-[1.2] font-bold text-[#24272c] max-2xl:text-[30px] max-xl:text-[28px] max-lg:text-[26px] max-md:text-2xl max-sm:mb-1.4 max-sm:text-[22px] max-[400px]:mb-1 max-[400px]:text-xl max-[350px]:text-lg";
const TEXT = "mb-0 text-[15px] font-medium text-[#6c737d] max-[400px]:text-sm";

export default function AppInfoSection() {
  return (
    <Section id="appinfo" className="bg-[linear-gradient(180deg,#fff_0%,#eaf6ff_100%)]">
      <Container>
        <SectionTitle heading="Users & Rating">
          Join thousands of happy users who trust AI Math Scanner <br /> for fast and accurate math solutions.
        </SectionTitle>
        <Row gutter={3} gutterSm={4} className="items-center justify-center">
          <Col xl={3} lg={4} sm={6} className="order-2 lg:order-1">
            <div className="text-center">
              <h3 className={HEADING}>10M+ Users</h3>
              <p className={TEXT}>
                AI Math Scanner makes solving math problems simple and quick with its step-by-step solutions for
                various math topics.
              </p>
            </div>
          </Col>
          <Col xl={6} lg={4} sm={12} className="order-1 lg:order-2">
            <img src="/appinfo/appinfo.svg" alt="Downloads & Rating" className="max-lg:mx-auto max-lg:max-w-4/5" />
          </Col>
          <Col xl={3} lg={4} sm={6} className="order-3 lg:order-3">
            <div className="text-center">
              <h3 className={HEADING}>4.8 Rating</h3>
              <p className={TEXT}>
                Perfect for students, teachers, and math enthusiasts, AI Math Scanner is the go-to app for solving
                complex math problems instantly.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}
