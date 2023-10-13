type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <main className="max-w-[500px] m-auto shadow-lg min-h-screen relative">
      {children}
    </main>
  );
}
