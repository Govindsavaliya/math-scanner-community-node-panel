/** Brand-coloured highlight inside headings. */
export function Accent({ children }) {
  return <span className="text-[#3f68b3]">{children}</span>;
}

/** Heading + subtitle shared by the landing page sections. */
export default function SectionTitle({ heading, children }) {
  return (
    <div className="relative mb-10 text-center max-lg:mb-9.5 max-md:mb-9 max-sm:mb-8.5 max-[400px]:mb-7.5 max-[320px]:mb-6.25">
      <h2 className="m-0 text-[34px] leading-[1.2] font-bold text-[#24272c] max-lg:text-[32px] max-md:text-[30px] max-sm:text-[28px] max-[400px]:text-[26px] max-[320px]:text-[24px]">
        {heading}
      </h2>
      <p className="mt-2 mb-0 text-base text-[#6c737d] max-lg:[&_br]:hidden max-md:text-[17px] max-sm:text-base max-[400px]:text-[15px] max-[320px]:text-[14px]">
        {children}
      </p>
    </div>
  );
}
