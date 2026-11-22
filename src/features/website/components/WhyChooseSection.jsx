import { Col, Container, Row } from "@/components/ui";
import { steps } from "../data";
import Section from "./Section";
import SectionTitle, { Accent } from "./SectionTitle";

/** Per-step accent colour and decorative background shape, keyed by step id. */
const THEME = {
  1: { shape: "before:bg-[url(/step/shape-1.svg)]", box: "border-[#1db2f3]", number: "text-[#1db2f3]" },
  2: { shape: "before:bg-[url(/step/shape-2.svg)]", box: "border-[#5748fa]", number: "text-[#5748fa]" },
  3: { shape: "before:bg-[url(/step/shape-3.svg)]", box: "border-[#ff4050]", number: "text-[#ff4050]" },
};

const COLUMN =
  "relative before:absolute before:bottom-0 before:left-1/2 before:flex before:h-100 before:w-100 before:-translate-x-1/2 before:items-end before:bg-contain before:bg-bottom before:bg-no-repeat before:content-[''] max-2xl:before:h-92.5 max-2xl:before:w-92.5 max-xl:before:hidden";
const BOX =
  "relative mx-auto mb-5 size-87.5 rounded-full border-3 bg-white px-8 py-14 text-center max-2xl:h-80 max-2xl:w-80 max-2xl:px-10 max-2xl:py-8 max-xl:h-full max-xl:w-auto max-xl:rounded-2xl max-xl:border-2 max-xl:p-5 max-md:p-4 max-sm:m-0 max-sm:h-auto max-sm:border";
const NUMBER =
  "mb-4 block text-[40px] leading-normal font-extrabold max-2xl:mb-3 max-xl:text-[34px] max-lg:text-[32px] max-md:text-[30px] max-sm:text-[28px] max-[400px]:text-[26px] max-[350px]:text-2xl";

export default function WhyChooseSection() {
  return (
    <Section id="whychoose" className="relative z-1 bg-[#fafdff]">
      <Container>
        <SectionTitle
          heading={
            <>
              Why Choose <Accent>AI Math Scanner?</Accent>
            </>
          }
        >
          Here's why you should choose AI Math Scanner, fast solutions, and interactive learning tools.
        </SectionTitle>
        <Row gutter={3} gutterSm={4} className="justify-center">
          {steps.map((step) => {
            const theme = THEME[step.id];
            return (
              <Col lg={4} sm={6} className={`${COLUMN} ${theme.shape}`} key={step.id}>
                <div className={`${BOX} ${theme.box}`}>
                  <span className={`${NUMBER} ${theme.number}`}>{step.number}</span>
                  <h3 className="mb-5 text-[18px] leading-normal font-bold text-[#24272c] max-2xl:mb-3 max-[400px]:text-[17px]">
                    {step.title}
                  </h3>
                  <p className="m-0 text-sm font-normal text-[#6c737d]">{step.description}</p>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Section>
  );
}
