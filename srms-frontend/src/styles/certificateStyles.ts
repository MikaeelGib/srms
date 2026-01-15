import React from "react";

export const pageWrapper: React.CSSProperties = {
  minHeight: "calc(100vh - 70px)",
  background: "linear-gradient(135deg, #04a4ef, #02396f)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20
};

export const card: React.CSSProperties = {
  width: 420,
  background: "linear-gradient(135deg, #1fe29e, #005b7f)",
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
  fontSize: 14
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
