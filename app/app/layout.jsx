export const metadata = {
  title: "Red Herring Initiative",
  description: "Civil Justice Advocacy • Florida",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: 40 }}>
        {children}
      </body>
    </html>
  );
}
