import { Link } from "react-router-dom";
import { Button, Card } from "@/components/ui";

/** Standard add/edit form footer: outline Cancel on the left of a filled primary Save, right-aligned. */
export default function FormActions({ cancelTo, onSave, submitting, saveLabel = "Save" }) {
  return (
    <Card.Footer className="flex items-center justify-end gap-3">
      <Link to={cancelTo}>
        <Button variant="outline-secondary">Cancel</Button>
      </Link>
      <Button variant="primary" onClick={onSave} disabled={submitting}>
        {submitting ? "Saving..." : saveLabel}
      </Button>
    </Card.Footer>
  );
}
