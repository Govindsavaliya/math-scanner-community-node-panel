import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "@/components/ui";
import { notify } from "@/lib/notify";
import { cn } from "@/utils/cn";
import { useSendContactMessage } from "../api";
import WebHeader from "../components/WebHeader";
import WebFooter from "../components/WebFooter";

const INPUT =
  "block min-h-[calc(1.7em+1rem+2px)] w-full appearance-none rounded-xl border bg-canvas px-4 py-3 text-base leading-normal font-normal text-[#212529] transition-colors duration-150 placeholder:text-[#a9b2bd] focus:outline-none max-md:py-2.4 max-sm:py-2";
const INPUT_VALID = "border-[#dee2e6] focus:border-[#86b7fe]";
const INPUT_INVALID = "border-[#dc3545]";
const FORM_ERROR =
  "mt-2 mb-0 inline-block rounded-[0.425rem] bg-[rgba(253,21,21,0.1)] px-2.5 py-0.5 text-sm font-normal text-[#fd1515]";
const POLICY_LINK = "text-ink hover:text-primary";

const EMPTY_FORM = { name: "", email: "", description: "" };

const NAME_REGEX = /^[A-Za-z\s'-]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Message is optional, as in the original form. */
function validate(formData) {
  const errors = { ...EMPTY_FORM };

  if (!formData.name.trim()) {
    errors.name = "Please enter your full name";
  } else if (!NAME_REGEX.test(formData.name)) {
    errors.name = "Only letters, spaces, apostrophes, and hyphens are allowed";
  }

  if (!formData.email.trim()) {
    errors.email = "Please enter your email";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "Email is not valid";
  }

  return errors;
}

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_FORM);
  const send = useSendContactMessage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const found = validate(formData);
    setErrors(found);
    if (found.name || found.email) return;

    send.mutate(formData, {
      onSuccess: (body) => {
        notify.success(body.response_message, {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData(EMPTY_FORM);
        setErrors(EMPTY_FORM);
      },
      onError: (error) => {
        // `response_code: false` answers were silently ignored by the old page.
        if (error.status === 200) return;

        if (error.status === 422) {
          const validationErrors = error.data?.errors ?? {};
          const messages = {};
          if (validationErrors.name) messages.name = validationErrors.name[0];
          if (validationErrors.email) messages.email = validationErrors.email[0];
          if (validationErrors.description) messages.description = validationErrors.description[0];
          setErrors(messages);

          notify.error("Please fix the errors in the form", { autoClose: 5000 });
        } else {
          notify.error("An error occurred. Please try again.", { autoClose: 5000 });
        }
      },
    });
  };

  return (
    <>
      <WebHeader />
      <section className="relative z-1 w-full bg-white pt-31.25 pb-11.25 max-lg:pt-30 max-md:pt-27.5 max-sm:pt-25">
        <Container>
          <div className="text-center">
            <h1 className="mb-2 text-[34px] leading-[1.2] font-bold text-[#24272c] max-lg:text-[32px] max-md:text-[30px] max-sm:text-[28px] max-[400px]:text-[26px] max-[350px]:text-2xl">
              Get In Touch With <span className="text-[#3f68b3]">AI Math Scanner</span>
            </h1>
            <p className="mb-11 text-[18px] leading-normal font-medium text-[#6c737d] max-2xl:mb-10 max-xl:mb-9 max-lg:mb-8 max-md:mb-7 max-md:text-[17px] max-sm:mb-6 max-sm:text-base max-[400px]:mb-5 max-[400px]:text-[15px] max-[350px]:mb-4 max-[350px]:text-sm">
              Need assistance? Reach out to us for inquiries or support, we're here to help!
            </p>
          </div>
          <Row>
            <Col xs={12}>
              <div className="relative z-1 rounded-[1.25rem] bg-white p-12 shadow-[0_10px_22px_3px_rgba(125,143,178,0.16)] max-2xl:p-9 max-xl:p-8 max-lg:p-7 max-md:p-6 max-sm:p-5 max-[400px]:p-4 max-[350px]:p-3">
                <Row>
                  <Col lg={5}>
                    <img
                      src="/contact/contact.svg"
                      alt="Contact AI Math Scanner"
                      className="mx-auto max-xl:max-w-9/10 max-lg:mb-8 max-lg:max-w-4/5 max-md:mb-7 max-sm:mb-6 max-[400px]:my-5 max-[400px]:max-w-7/10 max-[350px]:my-4 max-[350px]:max-w-4/5"
                    />
                  </Col>
                  <Col lg={7}>
                    <form id="contactForm" onSubmit={handleSubmit}>
                      <Row gutter={3} className="md:[--gx:1.5rem] md:[--gy:1.5rem]">
                        <Col lg={6}>
                          <input
                            type="text"
                            className={cn(INPUT, errors.name ? INPUT_INVALID : INPUT_VALID)}
                            placeholder="Full Name"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                          {errors.name && (
                            <div className={FORM_ERROR} id="nameError">
                              {errors.name}
                            </div>
                          )}
                        </Col>
                        <Col lg={6}>
                          <input
                            type="email"
                            className={cn(INPUT, errors.email ? INPUT_INVALID : INPUT_VALID)}
                            placeholder="Email Address"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          {errors.email && (
                            <div className={FORM_ERROR} id="emailError">
                              {errors.email}
                            </div>
                          )}
                        </Col>
                        <Col xs={12}>
                          <textarea
                            id="description"
                            className={cn(INPUT, errors.description ? INPUT_INVALID : INPUT_VALID)}
                            placeholder="Your Message..."
                            name="description"
                            rows="5"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </Col>
                        <Col xs={12}>
                          <p className="mt-4 mb-4 block text-center text-xs leading-normal font-normal text-[#6c737d] max-xl:mt-2 max-sm:mt-1 max-[400px]:mt-0">
                            By continuing, I agree to the{" "}
                            <Link to="/privacy-policy" target="_blank" className={POLICY_LINK}>
                              Privacy Policy
                            </Link>{" "}
                            &amp;{" "}
                            <Link to="/terms-of-use" target="_blank" className={POLICY_LINK}>
                              Terms of Use
                            </Link>
                          </p>
                          <button
                            type="submit"
                            className="block w-full cursor-pointer rounded-xl border border-[#3f68b3] bg-[#3f68b3] px-5 py-2.5 text-center text-base leading-normal font-semibold text-white select-none focus:outline-none disabled:pointer-events-none disabled:opacity-65"
                            id="submitBtn"
                            disabled={send.isPending}
                          >
                            {send.isPending ? (
                              <>
                                <span
                                  className="mr-2 inline-block size-4 animate-[spin_0.75s_linear_infinite] rounded-full border-[0.2em] border-current border-r-transparent align-[-0.125em]"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Submitting...
                              </>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </Col>
                      </Row>
                    </form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <WebFooter />
    </>
  );
}
