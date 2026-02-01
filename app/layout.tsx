export const metadata = {
  title: 'Red Herring Initiative Corporation',
  description: 'Civil justice advocacy and education platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
