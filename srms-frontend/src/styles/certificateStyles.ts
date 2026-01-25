import React from "react";

export const pageWrapper: React.CSSProperties = {
  minHeight: "calc(100vh - 70px)",
  background: "linear-gradient(135deg, #0F172A, #111827)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20
};

export const card: React.CSSProperties = {
  width: 420,
  background: "linear-gradient(135deg, #0D9488, #2563EB)",
  borderRadius: 20,
  padding: 50,
  color: "#fff",
  boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
};

export const input: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "none",
  outline: "none",
  fontSize: 14,
  marginTop: 8
};

export const label: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  marginTop: 15,
  marginBottom: 6
};

export const buttonPrimary: React.CSSProperties = {
  marginTop: 25,
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ef4444)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};

export const buttonSecondary: React.CSSProperties = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #38bdf8, #6366f1)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "center"
};

export const resultBox: React.CSSProperties = {
  marginTop: 30,
  background: "#00000055",
  padding: 16,
  borderRadius: 12
};

export const code: React.CSSProperties = {
  display: "block",
  wordBreak: "break-all",
  fontSize: 12
};

/* =======================
   MODAL STYLES (NEW)
======================= */

export const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

export const modal: React.CSSProperties = {
  width: 380,
  background: "linear-gradient(135deg, #24c88f, #005b7f)",
  borderRadius: 18,
  padding: 30,
  color: "#fff",
  boxShadow: "0 30px 70px rgba(0,0,0,0.35)"
};