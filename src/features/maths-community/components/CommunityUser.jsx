import Avatar from "@/components/common/Avatar";

/**
 * Avatar, name and a dotted meta line shown in a community card header.
 *
 * @param {number} [number]  Row number shown before the avatar.
 * @param {{user_image?: string, user_name?: string}} [profile]
 * @param {string[]} meta
 */
export default function CommunityUser({ number, profile, meta }) {
  const name = profile?.user_name;
  return (
    <div className="flex items-center">
      {number !== undefined && <span className="me-4 text-[20px] font-semibold">{number}</span>}
      <Avatar src={profile?.user_image} name={name} className="size-8.75" />
      <div>
        <h5 className="m-0 pl-3 text-[18px] font-semibold">{name || "-"}</h5>
        <ul className="m-0 flex items-center p-0">
          {meta.map((item) => (
            <li
              key={item}
              className="ml-6 list-disc text-[14px] marker:text-[var(--gray)] first:ml-3 first:list-none"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
