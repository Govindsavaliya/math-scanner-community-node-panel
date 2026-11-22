import { createContext, useContext } from "react";
import { cn } from "@/utils/cn";
import { FIELD, FILE, INVALID_BORDER, VALID_BORDER, controlClasses } from "./fieldClasses";

const GroupContext = createContext(null);

const SELECT_ARROW =
  "bg-[url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%3e%3cpath%20fill=%27none%27%20stroke=%27%2394a3b8%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%272%27%20d=%27m2%205%206%206%206-6%27/%3e%3c/svg%3e)] bg-[length:16px_12px] bg-[position:right_0.75rem_center] bg-no-repeat pr-8";

/** @param {boolean} [validated] Highlights invalid fields and shows their feedback. */
function Form({ validated, className, ...props }) {
  return <form className={cn(validated && "was-validated", className)} {...props} />;
}

function Group({ controlId, className, ...props }) {
  return (
    <GroupContext.Provider value={controlId}>
      <div className={className} {...props} />
    </GroupContext.Provider>
  );
}

function Label({ htmlFor, className, ...props }) {
  const controlId = useContext(GroupContext);
  return (
    <label
      htmlFor={htmlFor ?? controlId}
      className={cn("mb-1 block text-[14px] font-medium text-ink", className)}
      {...props}
    />
  );
}

/** Renders <input>, or any element via `as` (e.g. "textarea", "select"). */
function Control({ as: Component = "input", id, isInvalid, className, ...props }) {
  const controlId = useContext(GroupContext);
  return (
    <Component
      id={id ?? controlId}
      aria-invalid={isInvalid || undefined}
      className={cn(isInvalid ? cn(FIELD, FILE, INVALID_BORDER) : controlClasses, className)}
      {...props}
    />
  );
}

// `peer-*` reacts to the preceding Control (see FIELD); `.was-validated` comes from <Form validated>.
const FEEDBACK = {
  invalid:
    "mt-1 hidden w-full text-[0.875em] text-danger peer-aria-invalid:block [.was-validated_.peer:invalid~&]:block",
  valid: "mt-1 hidden w-full text-[0.875em] text-success [.was-validated_.peer:valid~&]:block",
};

function Feedback({ type = "invalid", className, ...props }) {
  return <div className={cn(FEEDBACK[type], className)} {...props} />;
}
Control.Feedback = Feedback;

function Select({ isInvalid, className, ...props }) {
  return (
    <select
      aria-invalid={isInvalid || undefined}
      className={cn(FIELD, SELECT_ARROW, isInvalid ? INVALID_BORDER : VALID_BORDER, className)}
      {...props}
    />
  );
}

const CHECK_INPUT =
  "peer float-left -ml-8 mt-0 size-[1.2em] appearance-none border border-line bg-surface bg-contain bg-center bg-no-repeat align-top checked:border-primary checked:bg-primary disabled:pointer-events-none disabled:opacity-50";
const CHECK_TYPES = {
  checkbox:
    "rounded-[0.25em] checked:bg-[url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20fill=%27none%27%20stroke=%27%23fff%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%273%27%20d=%27m6%2010%203%203%206-6%27/%3e%3c/svg%3e)]",
  radio:
    "rounded-full checked:bg-[url(data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%27-4%20-4%208%208%27%3e%3ccircle%20r=%272%27%20fill=%27%23fff%27/%3e%3c/svg%3e)]",
};

function Check({ type = "checkbox", inline, label, id, className, ...props }) {
  const controlId = useContext(GroupContext);
  const inputId = id ?? controlId;
  return (
    <div className={cn("min-h-6 pl-8", inline ? "mr-4 inline-block" : "mb-0.5 block", className)}>
      <input type={type} id={inputId} className={cn(CHECK_INPUT, CHECK_TYPES[type])} {...props} />
      {label && (
        <label
          htmlFor={inputId}
          className="text-[15px] font-medium text-muted peer-disabled:cursor-default peer-disabled:opacity-50"
        >
          {label}
        </label>
      )}
    </div>
  );
}

Form.Group = Group;
Form.Label = Label;
Form.Control = Control;
Form.Select = Select;
Form.Check = Check;

export default Form;
