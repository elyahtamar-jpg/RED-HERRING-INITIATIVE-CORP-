"use client";

import { useState, useEffect, useRef } from "react";
import Chatbot from "../../components/Chatbot";
import { speakText, startRecognition } from "../../utils/speech";

export default function ChatbotPage() {
  return (
    <div style={{ padding: "20px" }}>
      <Chatbot />
    </div>
  );
}
