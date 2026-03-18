/**
 * DeleteAgendaItemModal
 *
 * Confirmation modal for deleting a board agenda item.
 * Follows IMF brand, WCAG AA accessibility, and UX guidelines.
 *
 * DESIGN DECISIONS (pending user validation):
 *
 * Tech stack: No companion tech-stack skill was found. This component is
 * written as a plain React component with inline styles. Alternatives:
 *
 *   Option A (current): Plain React + inline styles + useRef/useEffect
 *     for focus management (zero dependencies beyond React)
 *   Option B: Fluent UI <Dialog> component with IMF theme overrides
 *     (handles focus trapping and Escape natively)
 *   Option C: Headless UI or Radix Dialog for unstyled accessible
 *     primitives with custom IMF styling
 *
 *   Recommendation: If Fluent UI is in the stack, Option B is strongly
 *   preferred — it handles focus trapping, Escape, backdrop click, and
 *   aria attributes out of the box. Please confirm.
 *
 * Colour mapping: Pending official semantic roles. Proposed colours:
 *
 *   Destructive action button → Red        #DA291C  (white text) — palette as-is
 *   Safe/cancel button        → Fund blue  #004C97  (white text, outline) — palette as-is
 *   Modal text                → Dark navy  #001E60  — palette as-is
 *   Warning banner border     → Amber      #F2A900  — palette as-is
 *
 * Derived surface colours (per "Derived colours, tints & transparency" rules):
 *
 *   Modal backdrop → rgba(0, 0, 0, 0.5)
 *     Rationale: Neutral value (hierarchy step 2). Does not use a brand
 *     colour with transparency. No flag needed.
 *
 *   Warning banner background → rgba(242, 169, 0, 0.08)
 *     Rationale: Derived tint (hierarchy step 3). Source: Amber #F2A900
 *     at 8% opacity over white. A neutral white/grey background would not
 *     visually associate the banner with its Amber border, so a tint is
 *     used. Flagged for review below.
 *
 *   ⚠ REVIEW: The warning banner background rgba(242,169,0,0.08) is a
 *   derived tint not in the approved palette. Please confirm this is
 *   acceptable or provide an official surface-warning token.
 *
 * Accessibility:
 *   - role="alertdialog" + aria-modal="true" for assistive tech
 *   - Focus traps inside modal while open
 *   - Focus moves to cancel button on open (safe default per UX rules)
 *   - Focus restores to trigger element on close
 *   - Escape key dismisses (same as Cancel)
 *   - Backdrop click dismisses
 *   - Destructive button is NOT default-focused (least risky default)
 *   - Contrast: white on Red #DA291C → ~4.6:1 ✓  |  Fund blue outline → ✓
 *
 * UX:
 *   - Warning text explains consequences before the action
 *   - Destructive button is visually distinct (red) and right-aligned
 *   - Cancel is the default-focused, prominent safe action
 *   - Explicit confirmation required — no accidental deletion
 */

import React, { useEffect, useRef, useCallback } from "react";

const COLORS = {
  fundBlue: "#004C97",
  darkNavy: "#001E60",
  red: "#DA291C",
  amber: "#F2A900",
  lightGrey: "#B1B3B3",
  white: "#FFFFFF",
  black: "#000000",
};

// Derived surface colours — see decision rationale above
const SURFACES = {
  // Neutral backdrop (hierarchy step 2: neutral value)
  backdrop: "rgba(0, 0, 0, 0.5)",
  // Derived tint (hierarchy step 3: Amber #F2A900 at 8% over white)
  // ⚠ Flagged for review — not an official palette value
  warningBannerBg: "rgba(242, 169, 0, 0.08)",
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.itemTitle - Title of the agenda item being deleted
 * @param {() => void} props.onConfirm - Called when user confirms deletion
 * @param {() => void} props.onCancel - Called when user cancels
 */
export default function DeleteAgendaItemModal({
  isOpen,
  itemTitle,
  onConfirm,
  onCancel,
}) {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Capture and restore focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      requestAnimationFrame(() => {
        cancelButtonRef.current?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  // Focus trap
  const handleKeyDown = useCallback((e) => {
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: SURFACES.backdrop,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "Arial, sans-serif",
      }}
      onClick={onCancel}
    >
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        style={{
          backgroundColor: COLORS.white,
          borderRadius: "8px",
          padding: "32px",
          maxWidth: "480px",
          width: "90%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2
          id="delete-modal-title"
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: COLORS.darkNavy,
            margin: "0 0 12px",
            lineHeight: "1.3",
          }}
        >
          Delete Agenda Item
        </h2>

        <p
          id="delete-modal-desc"
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: COLORS.darkNavy,
            margin: "0 0 24px",
          }}
        >
          You are about to permanently delete{" "}
          <span style={{ fontWeight: 700, color: COLORS.black }}>
            &ldquo;{itemTitle}&rdquo;
          </span>
          . This action cannot be undone.
        </p>

        {/* Warning banner — derived tint, flagged for review */}
        <div
          role="note"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            backgroundColor: SURFACES.warningBannerBg,
            border: `1px solid ${COLORS.amber}`,
            borderRadius: "4px",
            padding: "12px",
            margin: "0 0 24px",
            fontSize: "13px",
            lineHeight: "1.5",
            color: COLORS.black,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "18px" }}>
            ⚠
          </span>
          <span>
            All associated documents, comments, and vote records linked to this
            agenda item will also be removed.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "Arial, sans-serif",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: COLORS.white,
              color: COLORS.fundBlue,
              border: `2px solid ${COLORS.fundBlue}`,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "Arial, sans-serif",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: COLORS.red,
              color: COLORS.white,
              border: "2px solid transparent",
            }}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
