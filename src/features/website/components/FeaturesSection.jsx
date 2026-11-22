import { Col, Container, Row } from "@/components/ui";
import { features } from "../data";
import Section from "./Section";
import SectionTitle, { Accent } from "./SectionTitle";

/** Per-card hover accent (border + glow), keyed by feature id. */
const HOVER = {
  1: "hover:border-[#1db2f3] hover:shadow-[0_0_10px_0_rgba(29,178,243,0.15)]",
  2: "hover:border-[#ff8a23] hover:shadow-[0_0_10px_0_rgba(255,138,35,0.15)]",
  3: "hover:border-[#ff4050] hover:shadow-[0_0_10px_0_rgba(255,64,80,0.15)]",
  4: "hover:border-[#5748fa] hover:shadow-[0_0_10px_0_rgba(87,72,250,0.15)]",
  5: "hover:border-[#00b364] hover:shadow-[0_0_10px_0_rgba(0,179,100,0.15)]",
  6: "hover:border-[#b97a66] hover:shadow-[0_0_10px_0_rgba(185,122,102,0.15)]",
};

const CARD =
  "h-full rounded-2xl border border-transparent bg-white p-6 transition-all duration-300 max-xl:p-5 max-md:p-4 max-[350px]:p-3";

export default function FeaturesSection() {
  return (
    <Section
      id="features"
      className="relative z-1 bg-[linear-gradient(360deg,rgb(248,248,248)_0%,rgba(247,247,247,0)_100%)]"
    >
      <Container>
        <SectionTitle
          heading={
            <>
              Key Features Of <Accent> AI Math Scanner</Accent>
            </>
          }
        >
          Solve math problems quickly by scanning or typing your equation with AI.
        </SectionTitle>
        <Row gutter={3} gutterSm={4}>
          {features.map((feature) => (
            <Col lg={4} sm={6} key={feature.id}>
              <div className={`${CARD} ${HOVER[feature.id]}`}>
                <img src={feature.img} alt={feature.alt} title={feature.title} />
                <h3 className="mt-6 mb-3 text-[18px] leading-[1.2] font-semibold text-[#24272c] max-xl:mt-5 max-xl:mb-2 max-lg:mt-4 max-[400px]:mt-3 max-[400px]:text-[17px] max-[350px]:text-base">
                  {feature.title}
                </h3>
                <p className="mb-0 text-sm text-[#6c737d] max-[350px]:text-[13px]">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="max-md:hidden">
        <img src="/features/shape.svg" className="absolute bottom-0 left-0 -z-10" alt="Decoration shape" />
        <img src="/features/shape.svg" className="absolute right-0 bottom-0 -z-10 -scale-x-100" alt="Decoration shape" />
      </div>
    </Section>
  );
}
