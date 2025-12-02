export const metadata = {
  title: "Red Herring Initiative Corp",
  description: "Civil Justice Advocacy Corporation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: "40px",
          background: "#f2f2f2",
        }}
      >
        {children}
      </body>
    </html>
  );
}
