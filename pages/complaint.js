import dynamic from "next/dynamic";

const HelyahBot = dynamic(() => import("../components/HelyahBot"), { ssr: false });

export default function Complaint() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Complaint Intake</h1>
      <HelyahBot />
    </div>
  );
}
