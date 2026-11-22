import { Col, Container, Row } from "@/components/ui";
import Section from "./Section";
import { Accent } from "./SectionTitle";

export default function AboutSection() {
  return (
    <Section id="about" className="bg-white">
      <Container>
        <Row gutter={3} gutterSm={4} className="items-center">
          <Col lg={5} md={5}>
            <img
              src="/about/about.png"
              className="mx-auto max-md:max-w-2/5 max-sm:max-w-1/2"
              alt="About AI Math Scanner: Maths Solver"
            />
          </Col>
          <Col lg={7} md={7}>
            <h3 className="mb-4 text-[34px] leading-[1.2] font-bold text-[#24272c] max-lg:text-[32px] max-md:text-[30px] max-sm:mb-3 max-sm:text-[28px] max-[400px]:mb-2.5 max-[400px]:text-[26px] max-[350px]:text-[24px]">
              About <Accent>AI Math Scanner: </Accent>Maths Solver
            </h3>
            <p className="m-0 text-[18px] text-[#6c737d] max-xl:text-[17px] max-lg:text-base max-[400px]:text-[14px]">
              AI Math Scanner: Maths Solver is a simple app designed to help students, teachers, and anyone who wants
              to make math easier with AI-powered instant solutions, it makes solving equations and learning new
              concepts quick and easy. Whether it's algebra, calculus, or other topics, this app provides clear,
              step-by-step solutions to simplify even the toughest problems.
            </p>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}
