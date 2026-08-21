
export default function PostIdLayout({ children,imageModal }: { children: React.ReactNode, imageModal: React.ReactNode }) {
  return (
    <>
      {imageModal}
      {children}
    </>
  );
}