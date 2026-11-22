import { Col, Container, Icon, Row } from "@/components/ui";
import { cn } from "@/utils/cn";
import { reviews } from "../data";
import Section from "./Section";
import SectionTitle, { Accent } from "./SectionTitle";

const STAR =
  "mr-1 fill-current text-[26px] max-lg:text-2xl max-md:text-[22px] max-sm:text-xl";
const TITLE =
  "mb-2 line-clamp-1 text-[18px] leading-normal font-bold text-[#24272c] max-md:text-[17px] max-sm:text-base max-[400px]:text-[15px] max-[350px]:text-sm";
const USER_NAME =
  "mb-0 line-clamp-1 text-[18px] leading-normal font-bold text-[#111] max-md:text-[17px] max-sm:text-base max-[400px]:text-[15px] max-[350px]:text-sm";

function Stars({ rating }) {
  return [...Array(5)].map((_, index) => (
    <Icon key={index} name="star" className={cn(STAR, index < rating ? "text-[#febb36]" : "text-[#d6d7d9]")} />
  ));
}

export default function ReviewsSection() {
  return (
    <Section id="reviews" className="relative z-1 bg-white">
      <Container>
        <SectionTitle
          heading={
            <>
              Our <Accent>User</Accent> Feedback
            </>
          }
        >
          See how AI Math Scanner is transforming math learning
        </SectionTitle>
        <Row gutter={3} gutterSm={4} className="justify-center">
          {reviews.map((review) => (
            <Col lg={4} sm={6} key={review.id}>
              <div className="h-full rounded-2xl border border-[rgba(118,118,128,0.12)] bg-white p-5 max-sm:p-4">
                <div className="mb-2">
                  <Stars rating={review.rating} />
                </div>
                <h4 className={TITLE}>{review.title}</h4>
                <p className="mb-4 line-clamp-4 text-sm font-normal text-[#6c737d] max-[350px]:text-[13px]">
                  {review.description}
                </p>
                <div className="flex items-center">
                  <img
                    src={review.userImg}
                    alt={review.userName}
                    className="max-md:size-12.5 max-sm:size-11.25 max-[400px]:size-10"
                  />
                  <div className="ml-3">
                    <h4 className={USER_NAME}>{review.userName}</h4>
                    <span className="text-sm font-medium text-[#6c737d]">{review.date}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="max-xl:hidden">
        <img
          src="/review/quote-left.svg"
          className="absolute top-25 left-22.5 -z-10 max-[1600px]:top-32.5 max-[1600px]:left-4"
          alt="Quote decoration"
        />
        <img
          src="/review/quote-right.svg"
          className="absolute right-22.5 bottom-12.5 -z-10 max-[1600px]:right-4 max-[1600px]:bottom-4"
          alt="Quote decoration"
        />
      </div>
    </Section>
  );
}
