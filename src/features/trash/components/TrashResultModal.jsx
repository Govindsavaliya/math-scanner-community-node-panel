import { Button, Icon, Modal } from "@/components/ui";

/**
 * Outcome of a bulk restore / bulk delete / empty trash call.
 *
 * @param {{title: string, lines: string[], problems: {label: string, message?: string, blockers?: string[]}[]} | null} result
 */
export default function TrashResultModal({ result, onHide }) {
  return (
    <Modal show={Boolean(result)} onHide={onHide} size="lg">
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{result?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="m-0 mb-4 list-none space-y-1 p-0 text-[14px] text-ink">
          {result?.lines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <Icon name="check" className="mt-0.5 shrink-0 text-success" />
              {line}
            </li>
          ))}
        </ul>

        {result?.problems.length > 0 && (
          <>
            <p className="mb-2 text-[12px] font-semibold tracking-wider text-muted uppercase">
              Skipped or failed ({result.problems.length})
            </p>
            <ul className="m-0 max-h-80 list-none space-y-2 overflow-y-auto p-0">
              {result.problems.map((problem) => (
                <li key={problem.label} className="rounded-lg border border-line bg-warning/10 p-3 text-[13px]">
                  <p className="m-0 font-medium text-ink">{problem.label}</p>
                  {problem.message && <p className="m-0 mt-0.5 text-muted">{problem.message}</p>}
                  {problem.blockers?.map((blocker) => (
                    <p key={blocker} className="m-0 mt-0.5 text-warning">
                      {blocker}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
}
