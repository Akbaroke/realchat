type Props = {
  children: React.ReactElement;
};

export default function Container({ children }: Props) {
  return (
    <main className="max-w-[500px] m-auto overflow-x-hidden shadow-lg min-h-screen">
      {children}
    </main>
  );
}
