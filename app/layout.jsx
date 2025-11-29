export const metadata = {
  title: "Red Herring Initiative",
  description: "Civil Justice Advocacy Corporation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
